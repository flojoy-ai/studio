#!/bin/bash
CWD="$PWD"
branch_name_apps=$1
echo "Pulling latest from branch '$branch_name_apps' for APPS"
if [ "$(ls -A $CWD/apps)" ]; then  # check if folder is not empty
    cd $CWD/apps && git pull origin main && git checkout $branch_name_apps && git pull origin $branch_name_apps
else
    cd $CWD && git clone -b $branch_name_apps https://github.com/flojoy-io/apps.git
fi
source_dir="$CWD/apps"
target_dir="$CWD/public/example-apps"
# Remove all existing example-apps from public folder
rm -rf "$target_dir"/*
# Copy all example-apps from app folder
cp -R "$source_dir"/* "$target_dir"/

branch_name_nodes=$2
echo "Pulling latest from branch '$branch_name_nodes' for NODES"
if [ "$(ls -A $CWD/PYTHON/nodes)" ]; then  # check if folder is not empty
    cd $CWD/PYTHON/nodes && git pull origin main && git checkout $branch_name_nodes && git pull origin $branch_name_nodes
else
    cd $CWD/PYTHON && git clone -b $branch_name_nodes https://github.com/flojoy-io/nodes.git
fi
