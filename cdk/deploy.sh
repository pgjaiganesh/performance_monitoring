#!/usr/bin/env bash
export AWS_PROFILE=""
export HOSTEDZONE_ID=''
export DOMAIN_NAME=''
export MONITOR_DOMAIN_PREFIX=""
export ORG_UNIT_ID=""
export DEPLOY_STAGING="TRUE"
export DEPLOY_MULTICDN="FALSE"
DEPLOY_AWS_REGION="us-east-1"

export CDK_DEPLOY_REGION=$DEPLOY_AWS_REGION
npx cdk bootstrap --profile $AWS_PROFILE
npx cdk deploy --profile $AWS_PROFILE