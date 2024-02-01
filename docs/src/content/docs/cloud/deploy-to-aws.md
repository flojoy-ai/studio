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

## Prerequisites

- An AWS account.

- Active AWS SES with domain (For sending verification emails).

- An IAM role with proper SES policy. (We'll describe this in next step)

- Enabled Google Oauth2.0 API. [See here](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)

- A valid domain (For SSL and HTTPS connection).

## Create IAM role

1. Log in to AWS account and Search for `IAM`, then go to `IAM` dashboard.

2. From left sidebar click on `Policies`.

3. Now click on `Create Policy`.

4. Now click on `JSON` button from right top of `Policy Editor` section.

5. Paste following data to input box:

```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ],
        "Resource":"*"
      }
    ]
  }
```

:::note
Adjust the `Resource` option as your need.
:::

6. Provide a Policy name and click `Create Policy`.

7. Now click on `Roles` from left sidebar.

8. Click on `Create Role`.

9. Select `AWS Service` and `EC2` in `use case` section then click `Next`.

10. Now search for just created policy name and select it then again click `Next`.

11. Give a Role name and click on `Create Role`

Done! we've created an IAM role for SES service which we can attach with our EC2 instance to allow cloud app to send verification emails.

## Steps to deploy on AWS

- First, Log into your AWS account. And head to EC2 dashboard. You can use search bar from top left corner for this. Just type `ec2` and you'll find the link for EC2 dashboard.

- From left side bar select AMIs. Then change AMI type from `owned by me` to `public images` from dropdown before AMI search bar.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706057367/flojoy-docs/flojoy-cloud/pper1h8aqpgrsmzvy9iv.png)

- Now, in the AMI search input type for `Flojoy-Cloud-AMI` and you'll find our public AMI for cloud app. Select it then click on `Launch instances from AMI`.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706057689/flojoy-docs/flojoy-cloud/vqo3c4h6ubypoteekhsr.png)

- In the next page, provide a name to your instance. In `instance type` section select at least `t3.xlarge`( 4vCPU and 16GiB ram) to allow app run smooth and fast.

- In the next section select a key pair for SSH purpose. After that in `Network` section select `Allow HTTP traffic from the internet`, `Allow HTTPS traffic from the internet` and `Allow SSH traffic from` option.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706058441/flojoy-docs/flojoy-cloud/klw2yy5kjaqjqzfcupcl.png)

:::caution
It is recommended to specify only known ip address for SSH traffic.
:::

- Scroll down and click on `Advanced details` to expand that section.

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706058310/flojoy-docs/flojoy-cloud/fo7vaykvzuvus76dfjil.png)

- Select the IAM role just created with custom SES policy in `IAM instance profile` option.

- Then head to `user data` input at the bottom of `Advanced details` section and paste following bash script with valid domain name.

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

```

![image](https://res.cloudinary.com/dhopxs1y3/image/upload/v1706058131/flojoy-docs/flojoy-cloud/rvgasne65widbj0zsoy5.png)

:::caution
Don't forget to update the script with app domain name.
:::

- Almost there! now click on `launch instance` button.

- We're done with launching instance from Flojoy Cloud AMI. Now we're only two steps away from getting our app ready.

### Setup Credentials

Credentials are required for cloud app to run with it's all features. So we need to setup our own credentials. Let's do that in real quick with a few steps:

1. Go to EC2 dashboard from left sidebar. Then click on just launched instance and copy public ip.

2. Now connect to your EC2 instance with key-pair previously selected during configuring instance. Run following command to connect:

```sh
  ssh -i <path/to/key.pem> ubuntu@<public-ip>
```

3. Enable `root` mode:

```sh
  sudo su
```

4. Now open `/root/cloud/.env` file with your preferable editor `nano` or `vim` and paste following template with valid credentials:

```txt
AWS_REGION=""                           # AWS region
SENDER_EMAIL=""                         # Email registered for AWS SES
GOOGLE_CLIENT_ID=""                     # Google auth client id
GOOGLE_CLIENT_SECRET=""                 # Google client secret

GOOGLE_REDIRECT_URI="https://<cloud-domain>/login/google/callback"
NEXT_PUBLIC_URL_ORIGIN="https://<cloud-domain>"
```

:::note
Change `<cloud-domain>` with the domain name you want to use for this app
:::

5. Restart Cloud app service:

```sh
systemctl stop cloud_app
systemctl start cloud_app
```

This will build the app with new credentials and start the app.

### Enable HTTPS

We have deployed our own version of Flojoy cloud app. Now to allow app work properly we need to configure SSL on launched EC2 instance. Let's do that:

1. Go to you domain provider website and add an 'A' record in your domain with the public ip of just launched EC2 instance.

:::note
If you're already connected to instance with SSH key and enabled root mode then jump to 4th step.
:::

2. Now connect to your EC2 instance with key-pair previously selected during configuring instance. Run following command to connect:

```sh
  ssh -i <path/to/key.pem> ubuntu@<public-ip>
```

3. Enable `root` mode:

```sh
  sudo su
```

4. Install `Certbot`:

```bash
  sudo apt update
  sudo snap install --classic certbot
```

5. Prepare `Certbot`:

```bash
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

6. Get and install SSL certificate:

```bash
sudo certbot --nginx -d <your-domain-name>
```

And follow on screen instruction. This will get and install SSL certificate.

7. Restart Nginx:

```bash
systemctl restart nginx
```

Now visit `https://your-domain.com` and you should able to see Flojoy cloud app.

:::note
If you see "502 Bad Gateway", that means cloud app is still in build. Allow few minutes to start the app.
:::

Having issues with deployment? Join our [Discord Community](https://discord.gg/7HEBr7yG8c) and we will help you out!
