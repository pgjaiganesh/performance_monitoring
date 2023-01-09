#!/usr/bin/env bash
# the AWS CLI profile name to be used.
export AWS_PROFILE=""
# export HOSTEDZONE_ID=''
# export DOMAIN_NAME=''
export MONITOR_DOMAIN_NAME=""
# AWS Organization ID
export ORG_UNIT_ID=""
# Deploy staging configuration for Real User Measurements with Continuous Deployment feature 
# export DEPLOY_STAGING="TRUE"
# Deploy config to support multi-cdn
# export DEPLOY_MULTICDN="FALSE"
# AWS Region to deploy the solution
export CDK_DEPLOY_REGION=""
npm install
npx cdk bootstrap --profile $AWS_PROFILE
npx cdk deploy --profile $AWS_PROFILE