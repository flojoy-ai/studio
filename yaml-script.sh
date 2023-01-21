#!/bin/bash


CWD="$PWD"

FILE=$HOME/.flojoy/flojoy.yaml
if test -f "$FILE"; 
then
   touch $HOME/.flojoy/flojoy.yaml
   echo "PATH: $CWD" > $HOME/.flojoy/flojoy.yaml
   echo "$FILE exists."
else
   mkdir $HOME/.flojoy && touch $HOME/.flojoy/flojoy.yaml
   echo "PATH: $CWD" > $HOME/.flojoy/flojoy.yaml
   echo "directory ~/.flojoy/flojoy.yaml does not exists. Creating new directory with yaml file."
fi
