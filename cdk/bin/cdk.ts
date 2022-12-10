#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack, CdkStackProps } from '../lib/cdk-stack';

const app = new cdk.App();
const cfMonitorStack = new CdkStack(app, 'CloudFrontMonitoringStack', {
  env: { account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION },
  terminationProtection: true,
  hostedZoneId: process.env.HOSTEDZONE_ID,
  domainName: process.env.DOMAIN_NAME,
  monitorDomainPrefix: process.env.MONITOR_DOMAIN_PREFIX,
} as CdkStackProps);

cdk.Tags.of(cfMonitorStack).add('createdBy', 'CloudFrontMonitoringStack');