import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as util from "util";
import * as path from "path";
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps, Fn } from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { R53Construct } from './R53Construct';
import { aws_rum as rum } from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as grafana from 'aws-cdk-lib/aws-grafana';

export interface CdkStackProps extends StackProps {
  hostedZoneId: any;
  domainName: any;
  monitorDomainPrefix: any;
  profile: any;
  deployStaging: boolean;
  deployMultiCDN: boolean;
  organizationalUnitId: string;
}

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: CdkStackProps) {
    super(scope, id, props);

    let s3Bucket = new s3.Bucket(this, "s3",
      {
        removalPolicy: RemovalPolicy.DESTROY,
      });

    const deployment = new s3deploy.BucketDeployment(this, "s3deploy", {
      sources: [s3deploy.Source.asset(path.join(__dirname, '/../../frontend/'))],
      destinationBucket: s3Bucket,
    });

    let route53Construct = new R53Construct(this, "route53", {
      domainName: props?.domainName,
      hostedZoneId: props?.hostedZoneId,
    });

    let fqdn = `${props?.monitorDomainPrefix}.${props?.domainName}`;
    let cert = new acm.Certificate(this, "cert", {
      domainName: fqdn,
      validation: acm.CertificateValidation.fromDns(route53Construct.portalHostedZone),
    });

    let originId = "s3origin";
    let s3Origin = new origins.S3Origin(s3Bucket, {
      originId,
    });

    let cachePolicy = new cloudfront.CachePolicy(this, "cachePolicy", {
      // headerBehavior: cloudfront.CacheHeaderBehavior.allowList('origin'),
      // queryStringBehavior: cloudfront.CacheQueryStringBehavior.allowList('regionCode', 'serviceCode', 'fromLocation'),
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
      minTtl: Duration.seconds(0),
      maxTtl: Duration.seconds(30),
      defaultTtl: Duration.seconds(30),
    });

    let cfFunction = new cloudfront.Function(this, "CDNRandomizer", {
      code: cloudfront.FunctionCode.fromFile({
        filePath: path.join(__dirname, '../src/cloudfront-functions/viewer-response/index.js')
      })
    });

    let envProd = "prod";
    let defaultResponseHeaderPolicies = [this.createResponseHeaderPolicy1("default", "default", envProd, originId)];
    let distribution = new cloudfront.Distribution(this, "cf", {

      defaultBehavior: {
        origin: s3Origin,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        cachePolicy: cachePolicy,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.fromResponseHeadersPolicyId(
          this, util.format("%s-%s-%s", Stack.of(this).stackName, "default", envProd), defaultResponseHeaderPolicies[0].attrId),
        ...(props?.deployMultiCDN && {
          functionAssociations: [{
            function: cfFunction,
            eventType: cloudfront.FunctionEventType.VIEWER_RESPONSE,
          }]
        }),
      },
      certificate: cert,
      domainNames: [fqdn],
      httpVersion: cloudfront.HttpVersion.HTTP2,
      comment: util.format("%s_%s_%s", Stack.of(this).stackName, Stack.of(this).region, "Description"),
    });

    let behaviors = [
      {
        name: "css",
        pattern: "*.css"
      },
      {
        name: "js",
        pattern: "*.js"
      },
      {
        name: "images",
        pattern: "/public/images/*"
      }
    ];

    behaviors.map(behavior => {
      // let responseHeaderPolicies = [this.createResponseHeaderPolicy(behavior, behavior),
      // this.createResponseHeaderPolicy(behavior.name, behavior.pattern, "stage");
      // this.createResponseHeaderPolicy1(behavior.name, behavior.pattern, envStage);
      distribution.addBehavior(behavior.pattern, s3Origin, {
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        cachePolicy: cachePolicy,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.fromResponseHeadersPolicyId(this,
          util.format("%s-%s-%s", Stack.of(this).stackName, behavior.name, envProd), this.createResponseHeaderPolicy1(behavior.name, behavior.pattern, envProd, originId).attrId),
        ...(props?.deployMultiCDN && {
          functionAssociations: [{
            function: cfFunction,
            eventType: cloudfront.FunctionEventType.VIEWER_RESPONSE,
          }]
        }),
      })
    });

    if (props?.deployStaging) {
      let envStage = "stage";
      this.createResponseHeaderPolicy1("default", "default", envStage, originId);
      behaviors.map(behavior => {
        // let responseHeaderPolicies = [this.createResponseHeaderPolicy(behavior, behavior),
        // this.createResponseHeaderPolicy(behavior.name, behavior.pattern, "stage");
        this.createResponseHeaderPolicy1(behavior.name, behavior.pattern, envStage, originId);
      });
    }

    route53Construct.addCFRecord(distribution, props?.monitorDomainPrefix!);

    let identityPool = new cognito.CfnIdentityPool(this, 'rum-idp', {
      identityPoolName: `${Stack.of(this).stackName}-rum-idp`,
      allowUnauthenticatedIdentities: true,
      allowClassicFlow: true,
    });

    let rumMonitorName = `${Stack.of(this).stackName}-rum`;

    let idpRole = new iam.Role(this, "idp-role", {
      assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com'),
      inlinePolicies: {
        customPolicy1: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              resources: [`arn:aws:rum:${Stack.of(this).region}:${Stack.of(this).account}:appmonitor/${rumMonitorName}`],
              actions: ["rum:PutRumEvents"],
            }),
          ]
        }),
      },
    });

    idpRole.assumeRolePolicy?.addStatements(
      new iam.PolicyStatement({
        actions: ['sts:AssumeRoleWithWebIdentity'],
        principals: [new iam.FederatedPrincipal('cognito-identity.amazonaws.com')],
        conditions:
        {
          "StringEquals": {
            "cognito-identity.amazonaws.com:aud": identityPool.ref
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "unauthenticated"
          }
        }
      })
    );

    new cognito.CfnIdentityPoolRoleAttachment(this, "idp-role-attachment", {
      identityPoolId: identityPool.ref,
      roles: {
        'unauthenticated': idpRole.roleArn,
      }
    });

    let cfnAppMonitor = new rum.CfnAppMonitor(this, 'rum', {
      domain: fqdn,
      name: rumMonitorName,
      // the properties below are optional
      appMonitorConfiguration: {
        allowCookies: true,
        // enableXRay: false,
        // guestRoleArn: 'guestRoleArn',
        identityPoolId: identityPool.ref,
        // includedPages: ['includedPages'],
        // metricDestinations: [{
        //   destination: 'destination',

        //   // the properties below are optional
        //   destinationArn: 'destinationArn',
        //   iamRoleArn: 'iamRoleArn',
        //   metricDefinitions: [{
        //     name: 'name',

        //     // the properties below are optional
        //     dimensionKeys: {
        //       dimensionKeysKey: 'dimensionKeys',
        //     },
        //     eventPattern: 'eventPattern',
        //     unitLabel: 'unitLabel',
        //     valueKey: 'valueKey',
        //   }],
        // }],
        sessionSampleRate: 1,
        telemetries: ['http', 'errors'],
      },
      cwLogEnabled: true,
    });
    this.createGrafanaWorkspace(props?.organizationalUnitId);
  }

  createGrafanaWorkspace(orgId?: string) {
    let role = new iam.Role(this, "grafana-role1", {
      assumedBy: new iam.ServicePrincipal('grafana.amazonaws.com', {
        conditions:
        {
          "StringEquals": {
            "aws:SourceAccount": `${Stack.of(this).account}`
          },
          "StringLike": {
            "aws:SourceArn": `arn:aws:grafana:${Stack.of(this).region}:${Stack.of(this).account}:/workspaces/*`
          }
        }
      }),
      inlinePolicies: {
        customPolicy1: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              resources: ['*'],
              effect: iam.Effect.ALLOW,
              actions: ["cloudwatch:DescribeAlarmsForMetric",
                "cloudwatch:DescribeAlarmHistory",
                "cloudwatch:DescribeAlarms",
                "cloudwatch:ListMetrics",
                "cloudwatch:GetMetricStatistics",
                "cloudwatch:GetMetricData",
                "cloudwatch:GetInsightRuleReport"],
            }),
            new iam.PolicyStatement({
              resources: ['*'],
              effect: iam.Effect.ALLOW,
              actions: ["logs:DescribeLogGroups",
                "logs:GetLogGroupFields",
                "logs:StartQuery",
                "logs:StopQuery",
                "logs:GetQueryResults",
                "logs:GetLogEvents"]
            }),
            new iam.PolicyStatement({
              resources: ['*'],
              effect: iam.Effect.ALLOW,
              actions: ["ec2:DescribeTags",
                "ec2:DescribeInstances",
                "ec2:DescribeRegions"]
            }),
            new iam.PolicyStatement({
              resources: ['*'],
              effect: iam.Effect.ALLOW,
              actions: ["tag:GetResources"]
            }),
          ]
        }),
      },
    });

    // role.assumeRolePolicy?.addStatements(
    //   new iam.PolicyStatement({
    //     actions: ['sts:AssumeRole'],
    //     effect: iam.Effect.ALLOW,
    //     principals: [new iam.ServicePrincipal('grafana.amazonaws.com')],
    //     conditions:
    //     {
    //       "StringEquals": {
    //         "aws:SourceAccount": `${Stack.of(this).account}`
    //       },
    //       "StringLike": {
    //         "aws:SourceArn": `arn:aws:grafana:${Stack.of(this).region}:${Stack.of(this).account}:/workspaces/*`
    //       }
    //     }
    //   })
    // );

    return new grafana.CfnWorkspace(this, util.format("%s-%s", Stack.of(this).stackName, "workspace"),
      {
        dataSources: ["CLOUDWATCH"],
        accountAccessType: "CURRENT_ACCOUNT",
        authenticationProviders: ["AWS_SSO"],
        organizationalUnits: [orgId!],
        permissionType: "SERVICE_MANAGED",
        roleArn: role.roleArn
      });
  }
  createResponseHeaderPolicy1(name: string, pattern: string, stage?: string, originId?: string): cloudfront.CfnResponseHeadersPolicy {

    return new cloudfront.CfnResponseHeadersPolicy(this, util.format("%s-%s-%s-cfn", Stack.of(this).stackName, name, stage), {
      responseHeadersPolicyConfig: {
        name: util.format("%s-%s-%s", Stack.of(this).stackName, name, stage),
        corsConfig: {
          accessControlAllowCredentials: false,
          accessControlAllowHeaders: {
            items: ['*'],
          },
          accessControlAllowMethods: {
            items: ['GET', 'POST'],
          },
          accessControlAllowOrigins: {
            items: ['*'],
          },
          originOverride: false,
          // the properties below are optional
          // accessControlExposeHeaders: {
          //   items: ['*'],
          // },
          // accessControlMaxAgeSec: 600,
        },
        customHeadersConfig: {
          items: [
            {
              header: 'Timing-Allow-Origin',
              override: false,
              value: '*',
            },
            {
              header: 'Server-Timing',
              override: false,
              value: `origin;desc="${originId}",behavior;desc="${pattern}",stage;desc="${stage}"`,
            },
          ],
        },
        serverTimingHeadersConfig: {
          enabled: true,
          // the properties below are optional
          samplingRate: 100,
        },
      },
    });
  }
}