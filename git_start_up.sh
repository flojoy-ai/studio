#!/bin/bash
CWD="$PWD"
branch_name_apps=$1
if [ -z $branch_name_apps ];then
    cd $CWD/apps && git pull origin main
else
    cd $CWD/apps && git checkout $branch_name_apps && git pull
fi

branch_name_nodes=$2
if [ -z $branch_name_nodes ];then
    cd $CWD/PYTHON/nodes && git pull origin main
else
    cd $CWD/PYTHON/nodes && git checkout $branch_name_nodes && git pull
fi