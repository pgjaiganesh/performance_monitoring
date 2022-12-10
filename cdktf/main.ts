import { Construct } from "constructs";
import { App, Aspects, TerraformStack, TerraformOutput, Fn } from "cdktf";
// import { TerraformAsset, AssetType } from "cdktf";

import * as s3 from "./.gen/providers/aws/s3-bucket";
import * as s3obj from "./.gen/providers/aws/s3-object";
import * as grafana from "./.gen/providers/aws/grafana-workspace";
import * as roleassociation from "./.gen/providers/aws/grafana-role-association";
import * as iamrole from "./.gen/providers/aws/iam-role";
import * as aws from "./.gen/providers/aws/provider";
import * as user from "./.gen/providers/aws/identitystore-user";
import * as cwrum from "./.gen/providers/aws/rum-app-monitor";
import * as idp from "./.gen/providers/aws/cognito-identity-pool";
import * as idpRoleAttachment from "./.gen/providers/aws/cognito-identity-pool-roles-attachment";
import * as cfrhp from "./.gen/providers/aws/cloudfront-response-headers-policy";
import * as awscalleridentity from "./.gen/providers/aws/data-aws-caller-identity";
import * as ssoAdminInstance from "./.gen/providers/aws/data-aws-ssoadmin-instances";
import * as acm from "./.gen/providers/aws/acm-certificate";
import * as acmCertificateValidation from "./.gen/providers/aws/acm-certificate-validation";

import * as route53 from "./.gen/providers/aws/route53-record";

import * as cloudfront from "./.gen/providers/aws/cloudfront-distribution";
import * as oai from "./.gen/providers/aws/cloudfront-origin-access-identity";

import * as path from "path";
import * as util from "util";
import * as tags from "./tags";
import * as glob from 'glob';
import * as mime from 'mime-types';

// const variables = {
//   awsRegion: "us-east-1",
//   givenName: "",
//   familyName: "",
//   displayName: "",
//   userName: "monitor",
//   email: "",
//   organizationalUnitId: "",
//   domainname: "",
// };

const variables = {
  createUser: false,
  awsRegion: "us-east-1",
  givenName: "Jai2",
  familyName: "Girinathan2",
  displayName: "Jai2",
  userName: "monitor1",
  email: "ganeshji+sso2@amazon.com",
  organizationalUnitId: "r-yidw",
  domainname: "cfmon.demos.edge.aws.dev",
  hostedZoneId: "Z07319953J62AZLS1J9E2",
  awsProfile: "demoportal",
};

const grafanaAssumePolicy = {
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "GrafanaIAMPassRolePermission",
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "grafana.amazonaws.com"
      },
      "Condition": {
        "StringEquals": {
          "aws:SourceAccount": "ACCOUNT_ID"
        },
        "StringLike": {
          "aws:SourceArn": "arn:aws:grafana:REGION:ACCOUNT_ID:/workspaces/*"
        }
      }
    }]
};

const grafanaPolicy = {
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowReadingMetricsFromCloudWatch",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:DescribeAlarmsForMetric",
        "cloudwatch:DescribeAlarmHistory",
        "cloudwatch:DescribeAlarms",
        "cloudwatch:ListMetrics",
        "cloudwatch:GetMetricStatistics",
        "cloudwatch:GetMetricData",
        "cloudwatch:GetInsightRuleReport"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AllowReadingLogsFromCloudWatch",
      "Effect": "Allow",
      "Action": [
        "logs:DescribeLogGroups",
        "logs:GetLogGroupFields",
        "logs:StartQuery",
        "logs:StopQuery",
        "logs:GetQueryResults",
        "logs:GetLogEvents"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AllowReadingTagsInstancesRegionsFromEC2",
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeTags",
        "ec2:DescribeInstances",
        "ec2:DescribeRegions"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AllowReadingResourcesForTags",
      "Effect": "Allow",
      "Action": "tag:GetResources",
      "Resource": "*"
    }
  ]
};

const idpAssumePolicy = {
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "GrafanaIAMPassRolePermission",
      "Effect": "Allow",
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "COGNITO_IDENTITYPOOL_ID"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "unauthenticated"
        }
      }
    }]
};

const idpUnAuthenticatedPolicy = {
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "rum:PutRumEvents",
      "Resource": "arn:aws:rum:REGION:ACCOUNT_ID:appmonitor/IDP_NAME"
    }
  ]
};

const s3Policy = {
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CF OAI",
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Principal": {
        "AWS": "OAI_ARN"
      },
      "Resource": "S3_BUCKET_ARN"
    }]
};

class CDNCWRUMStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const prefix = util.format("%s", variables.awsRegion);

    const awsProvider = new aws.AwsProvider(this, util.format("%s-%s", prefix, "aws"), {
      region: variables.awsRegion,
      profile: variables.awsProfile,
    });

    const bucket = new s3.S3Bucket(this, util.format("%s-%s", prefix, "bucket"), {
      bucketPrefix: `${prefix}-${id}`,
    });

    const oaiObj = new oai.CloudfrontOriginAccessIdentity(this, util.format("%s-%s", prefix, "oai"));

    var s3PolicyStr = JSON.stringify(s3Policy);
    s3PolicyStr = s3PolicyStr.replace("S3_BUCKET_ARN", bucket.arn);
    s3PolicyStr = s3PolicyStr.replace("OAI_ARN", oaiObj.cloudfrontAccessIdentityPath);

    bucket.policy = s3PolicyStr;

    //upload css,images,css,jss
    const files = glob.sync(path.resolve(__dirname, '../frontend/public/**'), { absolute: false, nodir: true });
    console.log("Files count" + files.length);
    files.forEach(file => {
      console.log(file);
      const key = path.relative(path.resolve(__dirname, '../frontend/public/'), path.resolve(file));
      new s3obj.S3Object(this, `aws_s3_bucket_object_${path.basename(file)}`, {
        dependsOn: [bucket],            // Wait untill the bucket is not created
        key: `public/${key}`,       // Using relative path for folder structure on S3
        bucket: bucket.bucket,
        source: path.resolve(file),          // Using absolute path to upload
        etag: `${Date.now()}`,
        contentType: mime.contentType(path.extname(file)) || undefined       // Set the content-type for each object
      });
    });

    // upload html pages

    const files1 = glob.sync(path.resolve(__dirname, '../frontend/index*.html'), { absolute: false, nodir: true });
    console.log("Files count" + files.length);
    files1.forEach(file => {
      console.log(file);
      const key = path.relative(path.resolve(__dirname, '../frontend/'), path.resolve(file));
      new s3obj.S3Object(this, `aws_s3_bucket_object_${path.basename(file)}`, {
        dependsOn: [bucket],            // Wait untill the bucket is not created
        key: `${key}`,       // Using relative path for folder structure on S3
        bucket: bucket.bucket,
        source: path.resolve(file),          // Using absolute path to upload
        etag: `${Date.now()}`,
        contentType: mime.contentType(path.extname(file)) || undefined       // Set the content-type for each object
      });
    });

    const callerIdentity = new awscalleridentity.DataAwsCallerIdentity(this, util.format("%s-%s", prefix, 'aws-caller-identity'));

    var grafanaAssumePolicyStr = JSON.stringify(grafanaAssumePolicy);
    grafanaAssumePolicyStr = grafanaAssumePolicyStr.replace("REGION", awsProvider.region!);
    grafanaAssumePolicyStr = grafanaAssumePolicyStr.replace("ACCOUNT_ID", callerIdentity.accountId);
    grafanaAssumePolicyStr = grafanaAssumePolicyStr.replace("ACCOUNT_ID", callerIdentity.accountId);

    const role = new iamrole.IamRole(this, util.format("%s-%s", prefix, "grafana-role"), {
      assumeRolePolicy: grafanaAssumePolicyStr,
      inlinePolicy: [{
        name: "custom",
        policy: JSON.stringify(grafanaPolicy),
      }]
    });

    const gworkspace = new grafana.GrafanaWorkspace(this, util.format("%s-%s", prefix, "grafana-workspace"), {
      name: `${id}-workspace`,
      accountAccessType: "CURRENT_ACCOUNT",
      authenticationProviders: ["AWS_SSO"],
      organizationalUnits: [variables.organizationalUnitId],
      permissionType: "SERVICE_MANAGED",
      dataSources: ["CLOUDWATCH"],
      roleArn: role.arn,
    });

    if (variables.createUser) {
      const ssoAdmin = new ssoAdminInstance.DataAwsSsoadminInstances(this, util.format("%s-%s", prefix, "sso-admin"));

      const userObj = new user.IdentitystoreUser(this, util.format("%s-%s", prefix, "sso-user"), {
        name: {
          givenName: variables.givenName,
          familyName: variables.familyName,
        },
        identityStoreId: Fn.element(ssoAdmin.identityStoreIds, 0),
        displayName: variables.displayName,
        userName: variables.userName,
        emails: {
          primary: true,
          value: variables.email,
        },
      });

      new roleassociation.GrafanaRoleAssociation(this, util.format("%s-%s", prefix, "grafana-role-association"), {
        role: "ADMIN",
        userIds: [userObj.userId],
        workspaceId: gworkspace.id,
      });

      new TerraformOutput(this, util.format("%s-%s", prefix, "username"), {
        value: userObj.userName,
      });
    }

    const identityPool = new idp.CognitoIdentityPool(this, util.format("%s-%s", prefix, 'idp'), {
      identityPoolName: `${prefix}-${id}`,
      allowUnauthenticatedIdentities: true,
      allowClassicFlow: true,
    });

    const idpAssumePolicyStr = JSON.stringify(idpAssumePolicy);
    var idpUnAuthenticatedPolicyStr = JSON.stringify(idpUnAuthenticatedPolicy);
    idpUnAuthenticatedPolicyStr = idpUnAuthenticatedPolicyStr.replace("REGION", awsProvider.region!);
    idpUnAuthenticatedPolicyStr = idpUnAuthenticatedPolicyStr.replace("ACCOUNT_ID", callerIdentity.accountId);
    idpUnAuthenticatedPolicyStr = idpUnAuthenticatedPolicyStr.replace("IDP_NAME", identityPool.identityPoolName);

    const identityPoolRole = new iamrole.IamRole(this, util.format("%s-%s", prefix, "idp-role"), {
      assumeRolePolicy: idpAssumePolicyStr.replace("COGNITO_IDENTITYPOOL_ID", identityPool.id),
      inlinePolicy: [{
        name: "custom",
        policy: idpUnAuthenticatedPolicyStr,
      }]
    });

    new idpRoleAttachment.CognitoIdentityPoolRolesAttachment(this, util.format("%s-%s", prefix, "idp-role-attachment"), {
      identityPoolId: identityPool.id,
      roles: {
        "unauthenticated": identityPoolRole.arn
      }
    });

    const cwrumMonitor = new cwrum.RumAppMonitor(this, util.format("%s-%s", prefix, "cwrum"), {
      domain: variables.domainname,
      name: `${prefix}-${id}`,
      cwLogEnabled: true,
      appMonitorConfiguration: {
        telemetries: ["errors", "performance", "http"],
        sessionSampleRate: 1,
        allowCookies: true,
        identityPoolId: identityPool.id
      },
    });

    new cfrhp.CloudfrontResponseHeadersPolicy(this, util.format("%s-%s", prefix, "cfrhp"), {
      name: `${prefix}-${id}-sth-tao-policy`,
      serverTimingHeadersConfig: {
        enabled: true,
        samplingRate: 1,
      },
      customHeadersConfig: {
        items: [{
          header: "Timing-Allow-Origin",
          override: true,
          value: "*",
        }]
      }
    });

    const cert = new acm.AcmCertificate(this, util.format("%s-%s", prefix, "cert"), {
      domainName: variables.domainname,
      validationMethod: "DNS",
      provider: awsProvider,
    });

    const record = new route53.Route53Record(
      this,
      util.format("%s-%s", prefix, "r53Record"),
      {
        name: cert.domainValidationOptions.get(0).resourceRecordName,
        type: cert.domainValidationOptions.get(0).resourceRecordType,
        records: [cert.domainValidationOptions.get(0).resourceRecordValue],
        // zoneId: zone.zoneId,
        zoneId: variables.hostedZoneId,
        ttl: 60,
        allowOverwrite: true,
      }
    );

    new acmCertificateValidation.AcmCertificateValidation(
      this,
      util.format("%s-%s", prefix, "certvalidation"),
      {
        certificateArn: cert.arn,
        validationRecordFqdns: [record.fqdn],
        provider: awsProvider,
      }
    );

    const distribution = new cloudfront.CloudfrontDistribution(
      this,
      util.format("%s-%s", prefix, "cloudfront"),
      {
        enabled: true,
        isIpv6Enabled: true,

        viewerCertificate: {
          acmCertificateArn: cert.arn,
          sslSupportMethod: "sni-only",
        },

        restrictions: {
          geoRestriction: {
            restrictionType: "none",
          },
        },

        origin: [
          {
            originId: "s3",
            domainName: bucket.bucketRegionalDomainName,
            s3OriginConfig: {
              originAccessIdentity: oaiObj.cloudfrontAccessIdentityPath
            },
          },
        ],

        aliases: [variables.domainname],

        defaultCacheBehavior: {
          minTtl: 0,
          defaultTtl: 60,
          maxTtl: 86400,
          allowedMethods: [
            "DELETE",
            "GET",
            "HEAD",
            "OPTIONS",
            "PATCH",
            "POST",
            "PUT",
          ],
          cachedMethods: ["GET", "HEAD"],
          targetOriginId: "s3",
          viewerProtocolPolicy: "redirect-to-https",
          forwardedValues: {
            cookies: {
              forward: "all",
            },
            headers: [
              "Host",
              "Accept-Datetime",
              "Accept-Encoding",
              "Accept-Language",
              "User-Agent",
              "Referer",
              "Origin",
              "X-Forwarded-Host",
            ],
            queryString: true,
          },
        },
      }
    );

    new route53.Route53Record(this, "distribution_domain", {
      name: variables.domainname,
      type: "A",
      // zoneId: zone.zoneId,
      zoneId: variables.hostedZoneId,
      alias: [
        {
          name: distribution.domainName,
          zoneId: distribution.hostedZoneId,
          evaluateTargetHealth: true,
        },
      ],
    });

    new TerraformOutput(this, util.format("%s-%s", prefix, "distribution"), {
      value: distribution,
    });
    new TerraformOutput(this, util.format("%s-%s", prefix, "cwrummonitor"), {
      value: cwrumMonitor,
    });
  }
};

const app = new App();
const myStack = new CDNCWRUMStack(app, "cfmonitor");
// Add tags to every resource defined within `myStack`.
Aspects.of(myStack).add(new tags.TagsAddingAspect({ createdBy: "cfmonitor" }));
app.synth();
