#!/usr/bin/env bash

export AWS_PROFILE="workshop"
# export HOSTEDZONE_ID='Z07693971331AAKFPEYVC'
# export DOMAIN_NAME='ganeshji.people.aws.dev'
# DEPLOY_AWS_REGIONS=('us-east-1' 'us-west-1' 'eu-west-1' 'eu-central-1' 'ap-south-1' 'ap-southeast-1' 'ap-southeast-2')
# # DEPLOY_AWS_REGIONS=('ap-south-1' 'us-east-1' 'eu-west-1' )
# export RESPONSE_HEADER_POLICY_ID=
# export CACHE_POLICY_ID=
# export PRICING_CACHE_POLICY_ID=
# export ALB_RESPONSE_HEADER_POLICY_ID='47f3268e-d8e2-4fc5-91c7-b7abcc065885'

export AWS_PROFILE="demoportal"
export HOSTEDZONE_ID='Z07319953J62AZLS1J9E2'
export DOMAIN_NAME='demos.edge.aws.dev'
export MONITOR_DOMAIN_PREFIX="cfmon1"
export ORG_UNIT_ID="r-rqdg"
# export MONITOR_DOMAIN_PREFIX="multicdn"
# deploy staging configuration for CloudFront.Currently only ResponseHeaderPolicies are created
export DEPLOY_STAGING="TRUE"
export DEPLOY_MULTICDN="FALSE"
# DEPLOY_AWS_REGIONS=('us-east-1' 'us-west-1' 'eu-west-1' 'eu-central-1' 'ap-south-1' 'ap-southeast-1' 'ap-southeast-2')
# DEPLOY_AWS_REGIONS=('us-east-1' 'us-west-1' 'eu-west-1' )
DEPLOY_AWS_REGIONS=('us-east-1' )
# export RESPONSE_HEADER_POLICY_ID='03d06e25-9a83-4817-a5a8-92ac7da61dad'
# export CACHE_POLICY_ID='6b4e0fc7-e04b-4d23-89b9-7db8f0a909fb'
# export PRICING_CACHE_POLICY_ID='5f4074bb-2fe1-4a0a-8282-1fcf2acf2d23'
# export ALB_RESPONSE_HEADER_POLICY_ID='47f3268e-d8e2-4fc5-91c7-b7abcc065885'

for region in "${DEPLOY_AWS_REGIONS[@]}"
do
  export CDK_DEPLOY_REGION=$region
  shift; shift
  npx cdk bootstrap --profile $AWS_PROFILE
  npx cdk deploy --profile $AWS_PROFILE
done