#!/usr/bin/env bash

export AWS_PROFILE=""
export HOSTEDZONE_ID=''
export DOMAIN_NAME=''
DEPLOY_AWS_REGIONS=('us-east-1' )

for region in "${DEPLOY_AWS_REGIONS[@]}"
do
  export CDK_DEPLOY_REGION=$region
  shift; shift
  npx cdk bootstrap --profile $AWS_PROFILE
  npx cdk destroy --profile $AWS_PROFILE
done