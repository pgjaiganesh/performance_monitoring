# CloudFront Real User Monitoring

## Use cases:

1. monitor metrics like Cache Hit Ratio, Time to First Byte, Time to Last Byte, Page Load time, TCP/TLS connect time

1. compare performance metrics between CDNs, between origin vs CloudFront.

1. look at deeper metrics by content types (images, CSS, JS etc) for a particular CF distribution..

## AWS Services used:

CloudFront, CloudWatch RUM, CloudWatch Logs, Amazon Grafana, AWS Identity Center (AWS SSO)

## Architecture 

![CloudFront Performance](./images/cf-rum.png)


## Steps to build

1. Clone and deploy the CDK solution in AWS Region where CloudWatch RUM is available.

1. Change into the directory and run below commands
    - `cd performance_monitoring/web-vitals`
    - `npm install`
    - `npm audit fix`
    - `npm run build`

1. Change into the directory and run below commands
    - `cd performance_monitoring/cdk`

1. Edit `deploy.sh` to update the deployment variables
```
# the AWS CLI profile name to be used.
export AWS_PROFILE=''
# name of domain to add RUM
export MONITOR_DOMAIN_NAME=''
# AWS Organization ID
export ORG_UNIT_ID=''
# AWS Region to deploy the solution
export CDK_DEPLOY_REGION=''
```

1. Run `deploy.sh`