[![main: CI](https://github.com/flojoy-io/flojoy-desktop/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/flojoy-io/flojoy-desktop/actions/workflows/main.yml)

# Flojoy

Please see [https://docs.flojoy.io](https://docs.flojoy.io)

***
#### Running locally (Mac/Linux only)

1. Clone the repo
1. Make sure that you have Python, Redis, and Node already installed
1. `cd` into the project root
1. Install the required python packages: `pip install -r requirements.txt`
1. Install npm packages: `npm install`
1. Run `$ sh mac_startup.sh` (Flojoy does not run on Windows yet)

   - If you have `virtualenv` installed you can provide the path to the virtualenv folder as follows `sh mac_start_up.sh -v venv2`
   - You can provide optional argument `-r` which will shut down the existing redis server and spin up a fresh one

#### Running on Docker (Windows/Mac/Linux/any other os with docker)

1. Install docker if you haven't already.
2. Run `docker compose up` on the cli to build, create and run the containers, networks and volumes.
 First time it will take a while as it will pull the base images and build the containers. But after that it will be quite fast to run.
3. Run `npm start`
4. Go to [localhost:3000](http://localhost:3000) and start using flojoy.

Run `docker compose down` to stop and remove the containers, networks and volumes.

#### To view logs of any service

Currently there are four services.
**redis**, **rq-worker**, **backend**, **frontend**

To follow realtime log of any of them, open up a terminal and run:
`docker logs --follow --tail="all" flojoy-desktop-{service-name}-1`
You can also use the docker-desktop to control and check logs for the services.


#### Using electronjs locally
Run `npm run electron-dev` to start electron app locally. It will start the docker containers to run the necessary backend parts.
To package the electron app, run `npm run electron-package`. The `dist` folder will hold the generated artifacts.
