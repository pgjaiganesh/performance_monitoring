#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack, CdkStackProps } from '../lib/cdk-stack';
import { Aspects } from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag'

const app = new cdk.App();
// const stackName = "MultiCDNMonitorStack";
const stackName = "CloudFrontMonitoringStackv3";

const cfMonitorStack = new CdkStack(app, stackName, {
  env: { account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION },
  terminationProtection: true,
  // hostedZoneId: process.env.HOSTEDZONE_ID,
  // domainName: process.env.DOMAIN_NAME,
  monitorDomainName: process.env.MONITOR_DOMAIN_NAME,
  // deployStaging: process.env.DEPLOY_STAGING == "TRUE" ? true : false,
  // deployMultiCDN: process.env.DEPLOY_MULTICDN == "TRUE" ? true : false,
} as CdkStackProps);

cdk.Tags.of(cfMonitorStack).add('createdBy', stackName);
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }))