#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack, CdkStackProps } from '../lib/cdk-stack';

const app = new cdk.App();
// const stackName = "MultiCDNMonitorStack";
const stackName = "CloudFrontMonitoringStack";

const cfMonitorStack = new CdkStack(app, stackName, {
  env: { account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION },
  terminationProtection: true,
  hostedZoneId: process.env.HOSTEDZONE_ID,
  domainName: process.env.DOMAIN_NAME,
  monitorDomainPrefix: process.env.MONITOR_DOMAIN_PREFIX,
  deployStaging: process.env.DEPLOY_STAGING == "TRUE" ? true : false,
  deployMultiCDN: process.env.DEPLOY_MULTICDN == "TRUE" ? true : false,
  organizationalUnitId: process.env.ORG_UNIT_ID,
} as CdkStackProps);

cdk.Tags.of(cfMonitorStack).add('createdBy', stackName);