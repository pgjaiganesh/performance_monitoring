#!/usr/bin/env bash
# the AWS CLI profile name to be used.
# the AWS CLI profile name to be used.
export AWS_PROFILE=''
# name of domain to add RUM
export MONITOR_DOMAIN_NAME=''
# AWS Organization ID
export ORG_UNIT_ID=''
# AWS Region to deploy the solution
export CDK_DEPLOY_REGION=''
npm install
npx cdk bootstrap --profile $AWS_PROFILE
npx cdk deploy --profile $AWS_PROFILE