import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as util from "util";
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as r53targets from 'aws-cdk-lib/aws-route53-targets';
import * as aga from 'aws-cdk-lib/aws-globalaccelerator';

export interface R53onstructProps {
    hostedZoneId: any;
    domainName: any;
}

export class R53Construct extends Construct {
    public readonly portalHostedZone: route53.IHostedZone;

    constructor(scope: Construct, id: string, props: R53onstructProps) {
        super(scope, id);

        let domainName = props?.domainName;
        this.portalHostedZone = route53.HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
            zoneName: domainName,
            hostedZoneId: props?.hostedZoneId,
        });
    }

    addALBRecord(alb: elbv2.ApplicationLoadBalancer, backendDomainPrefix: string): string {
        return new route53.ARecord(this, "ALBRecord", {
            recordName: backendDomainPrefix,
            zone: this.portalHostedZone,
            target: route53.RecordTarget.fromAlias(new r53targets.LoadBalancerTarget(alb))
            // domainName: distribution.domainName,
        }).domainName;
    }

    addCFRecord(cf: cloudfront.Distribution, cfDomainPrefix: string): string {
        return new route53.ARecord(this, "CFRecord", {
            recordName: cfDomainPrefix,
            zone: this.portalHostedZone,
            target: route53.RecordTarget.fromAlias(new r53targets.CloudFrontTarget(cf))
            // domainName: distribution.domainName,
        }).domainName;
    }

    addAGARecord(aga: aga.Accelerator, backendDomainPrefix: string): string {
        return new route53.CnameRecord(this, "AGARecord", {
            recordName: backendDomainPrefix,
            zone: this.portalHostedZone,
            domainName: aga.dnsName,
            // target: route53.RecordTarget.fromValues(aga.dnsName)
            // domainName: distribution.domainName,
        }).domainName;
    }
}