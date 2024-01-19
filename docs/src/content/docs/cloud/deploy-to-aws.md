---
title: Deploy cloud to AWS
description: Deploy your own Flojoy Cloud app to AWS using Flojoy Cloud public AMI.
sidebar:
  order: 2
  badge:
    text: New
    variant: tip
---

Flojoy Cloud provides easiest way to supercharge your test & measurement data with
powerful data visualizations, Easy to use - APIs for Python, LabVIEW, and MATLAB.

You can use our public cloud app for your test and measurement from here -> <https://cloud.flojoy.ai>

Additionally, you can deploy your own cloud app with our public AWS AMI. In this tutorial I'll show you how to deploy your own cloud version of Flojoy cloud app with few very straightforward steps.

## Steps to deploy on AWS

- First, Log into your AWS account. And head to EC2 dashboard. You can use search bar from top left corner for this. Just type `ec2` and you'll find the link for EC2 dashboard.

- From left side bar select AMIs. Then change AMI type from `owned by me` to `public images` from dropdown before AMI search bar.

- Now, in the AMI search input type for `Flojoy-Cloud-AMI` and you'll find our public AMI for cloud app. Select it then click on `Launch instances from AMI`.

- In the next page, provide a name to your instance. In `instance type` section select at least `t3.large`( 2cpu and 8gb ram) to allow app run smooth and fast.

- In the next section select a key pair for SSH purpose. After that in `Network` section select `Allow HTTP traffic from the internet` option.

- Scroll down and click on `Advanced details` to expand that section. Then head to `user data` input and paste following template with valid credentials.

```sh
#!/bin/bash

public_ip=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

cat <<EOF >/root/cloud/.env

AUTH0_APP_DOMAIN=""
AUTH0_CLIENT_ID=""
AUTH0_CLIENT_SECRET=""

# Replace "${public_ip}" with your domain name
AUTH0_REDIRECT_URI="http://${public_ip}:80/login/auth0/callback"
AWS_ACCESS_KEY_ID=""
AWS_BUCKET_NAME=""
AWS_REGION=""
AWS_SECRET_ACCESS_KEY=""


# Required
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Replace "${public_ip}" with your domain name

GOOGLE_REDIRECT_URI="http://${public_ip}:80/login/google/callback"



EOF

```

Almost there! now click on `launch instance` button.

Done! you've just deployed your own version of Flojoy Cloud app.

:::note
Allow 5-10 mins for app to be ready. Then you can access your app with EC2 public ip or your assigned domain

:::caution
Flojoy Cloud AMI exposes app on HTTP 80. So you need to change url to http instead of https to access the app.
