#!/bin/bash

if [ -x "$(command -v docker)" ]; then
    echo "✔ Docker is installed"
else
    echo "❌ Docker not found. Install docker"
fi

var=$(docker compose version | grep "v2.")
if [ -n "$var" ]; then
    echo "✔ Docker compose is installed"
else
    echo "❌ Docker compose plugin not installed"
    exit 1
fi

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
composeFileLocation0="$SCRIPT_DIR/docker-compose-prod.yml"
composeFileLocation1="$SCRIPT_DIR/../docker-compose-prod.yml"

if test -f "composeFileLocation0"; then
    echo "docker-compose file found in the current directory"
    docker compose -f $composeFileLocation0 build
else
    echo "docker-compose file found in the parent directory"
    docker compose -f $composeFileLocation1 build
fi