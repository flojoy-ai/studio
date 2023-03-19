#!/bin/bash
CWD="$PWD"
branch_name_apps=$1
echo "Pulling latest from branch '$branch_name_apps' for APPS"
cd $CWD/apps && git pull origin main && git checkout $branch_name_apps

branch_name_nodes=$2
echo "Pulling latest from branch '$branch_name_nodes' for NODES"
cd $CWD/PYTHON/nodes && git pull origin main && git checkout $branch_name_nodes
