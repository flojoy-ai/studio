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

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706057367/flojoy-docs/flojoy-cloud/pper1h8aqpgrsmzvy9iv.png)

- Now, in the AMI search input type for `Flojoy-Cloud-AMI` and you'll find our public AMI for cloud app. Select it then click on `Launch instances from AMI`.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706057689/flojoy-docs/flojoy-cloud/vqo3c4h6ubypoteekhsr.png)

- In the next page, provide a name to your instance. In `instance type` section select at least `t3.large`( 2cpu and 8gb ram) to allow app run smooth and fast.

- In the next section select a key pair for SSH purpose. After that in `Network` section select `Allow HTTP traffic from the internet`, `Allow HTTPS traffic from the internet` and `Allow SSH traffic from` option.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706058441/flojoy-docs/flojoy-cloud/klw2yy5kjaqjqzfcupcl.png)

:::caution
It is recommended to specify only known ip address for SSH traffic.
:::

- Scroll down and click on `Advanced details` to expand that section.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706058310/flojoy-docs/flojoy-cloud/fo7vaykvzuvus76dfjil.png)

- Now head to `user data` input at the bottom of `Advanced details` section and paste following template with valid credentials.

```sh
#!/bin/bash

cloud_domain="your-domain.com" # Domain name to use for cloud e.g. cloud.flojoy.ai

cat <<EOF >/etc/nginx/conf.d/default.conf
server {
listen 80;

server_name ${cloud_domain};

location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade ;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_cache_bypass \$http_upgrade;
    }
}
EOF

cat <<EOF >/root/cloud/.env

AWS_ACCESS_KEY_ID=""                    # AWS access key
AWS_BUCKET_NAME=""                      # AWS S3 bucket name
AWS_REGION=""                           # AWS region
AWS_SECRET_ACCESS_KEY=""                # AWS secret key
GOOGLE_CLIENT_ID=""                     # Google auth client id
GOOGLE_CLIENT_SECRET=""                 # Google client secret

# Don't change below env value
GOOGLE_REDIRECT_URI="https://${cloud_domain}/login/google/callback"

EOF

```

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706058131/flojoy-docs/flojoy-cloud/rvgasne65widbj0zsoy5.png)

:::caution
Don't forget to update the script with app domain name and other credentials information.
:::

- Almost there! now click on `launch instance` button.

Done! you've just deployed your own version of Flojoy Cloud app.

### Enable HTTPS

We have deployed our own version of Flojoy cloud app. Now to allow app work properly we need to configure SSL on launched EC2 instance. Let's do that:


[To be continued...]