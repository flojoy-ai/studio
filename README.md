[![main: CI](https://github.com/flojoy-io/flojoy-desktop/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/flojoy-io/flojoy-desktop/actions/workflows/main.yml)

# Flojoy

Please see [https://docs.flojoy.io](https://docs.flojoy.io) for documentation

***

# Flojoy Quickstart

- [Run Flojoy with Docker](#run-flojoy-on-docker)
- [Run Flojoy without Docker (Mac/Linux only)](#run-flojoy-without-docker-maclinux-only)

## Run Flojoy on Docker

1. Install Docker if you haven't already (https://docs.docker.com/get-docker/).
2. Clone this project and `cd` into the project root in your CLI (such as Terminal for Mac or PowerShell for Windows).
3. Run `docker compose up` on the CLI to build, create and run the containers, networks and volumes. The first time, it will take a while as it will pull the base images and build the containers. But after that it will be quite fast to run.
4. Run `npm start`
5. Go to [localhost:3000](http://localhost:3000) and start using flojoy.

Run `docker compose down` to stop and remove the containers, networks and volumes.

### View logs of any service

Currently there are four services.
**redis**, **rq-worker**, **backend**, **frontend**

To follow realtime log of any of them, open up a terminal and run:
`docker logs --follow --tail="all" flojoy-desktop-{service-name}-1`
You can also use the docker-desktop to control and check logs for the services.

***

# For developers

## Run Flojoy without Docker (Mac/Linux only)

1. Clone this repo
2. Make sure that you have Python 3, Redis, and Node already installed. Please note that this project requires Python 3.
3. `cd` into the project root
4. Install the required python packages: `python3 -m pip install -U -r requirements.txt`
5. Install npm packages: `npm install`
6. Run `$ sh mac_startup.sh`

   - If you have `virtualenv` installed you can provide the path to the virtualenv folder as follows `sh mac_start_up.sh -v venv2`
   - You can provide optional argument `-r` which will shut down the existing redis server and spin up a fresh one
   - If you have not installed npm packages manually, provide `-n` argument to install packages.
   - If you have not installed python packages manually, provide `-p` argument to install required python packages. 
   - Optionally you can provide port number followed by `-P` argument to run backend server on specific port.

## Run ElectronJS locally
Run `npm run electron-dev` to start Electron app locally. It will start the Docker containers to run the necessary backend parts.
To package the electron app, run `npm run electron-package`. The `dist` folder will hold the generated artifacts.

## CD
Currently there are two CD workflows.
1. [Base image CD](.github/workflows/cd_image.yaml): Builds and pushes the base image used in [the docker files](./docker).
2. [CD](.github/workflows/cd.yaml): Runsi if a version tag is added. It builds packages, creates executables and creates github release with those artifacts.

#### Using CD to build executables
The CD workflow is triggered when any change is pushed to any tag. So, to trigger it,

1. Tag a commit with v*.. pattern. For example : `git tag v0.1.1`
2. push the commit and tag : `git push && git push --tags`
3. The CD workflow will then run, generate artifacts and create draft release with those artifacts.
4. Go to `https://github.com/flojoy-io/flojoy-desktop/releases` to check the new draft release.
