#!/usr/bin/env bash
export AWS_PROFILE="demoportal"
export HOSTEDZONE_ID='Z07319953J62AZLS1J9E2'
export DOMAIN_NAME='demos.edge.aws.dev'
export MONITOR_DOMAIN_PREFIX="cfmon1"
export ORG_UNIT_ID="r-rqdg"
# export MONITOR_DOMAIN_PREFIX="multicdn"
# deploy staging configuration for CloudFront.Currently only ResponseHeaderPolicies are created
export DEPLOY_STAGING="TRUE"
export DEPLOY_MULTICDN="FALSE"
DEPLOY_AWS_REGION="us-east-1"

export CDK_DEPLOY_REGION=$DEPLOY_AWS_REGION
npx cdk bootstrap --profile $AWS_PROFILE
npx cdk deploy --profile $AWS_PROFILE