#!/usr/bin/env bash
# the AWS CLI profile name to be used.
export AWS_PROFILE='default'
# name of domain to add RUM
export MONITOR_DOMAIN_NAME='d32zn1qwmm7aim.cloudfront.net'
# AWS Organization ID
export ORG_UNIT_ID='r-yidw'
# AWS Region to deploy the solution
export CDK_DEPLOY_REGION='eu-west-1'
npm install
# npm audit fix
npx cdk bootstrap --profile $AWS_PROFILE
npx cdk synth
npx cdk deploy --profile $AWS_PROFILE