#!/bin/bash
# source venv2/bin/activate
alias venv="source $HOME/venv/bin/activate"

helpFunction()
{
   echo ""
   echo "Usage: $0 -r -v venv-path"
   echo -r "shuts down existing redis server and spins up a fresh one"
   echo -v "path to a virtualenv"
   exit 1 # Exit script after printing help
}

while getopts "rv:" opt
do
   case "$opt" in
      r) initRedis=true ;;
      v) venv="$OPTARG" ;;
      ?) helpFunction ;; # Print helpFunction in case parameter is non-existent
   esac
done

echo 'update ES6 status codes file...'
python3 -c 'import yaml, json; f=open("src/STATUS_CODES.json", "w"); f.write(json.dumps(yaml.safe_load(open("STATUS_CODES.yml").read()), indent=4)); f.close();'

echo 'create symlinks...'
ln STATUS_CODES.yml PYTHON/WATCH/
ln STATUS_CODES.yml src

echo 'jsonify python functions and write to JS-readable directory'
python3 jsonify_funk.py

echo 'generate manifest for python nodes to frontend'
python3 generate_manifest.py

if [ $initRedis ]
then
    echo 'shutting down any existing redis server and clearing redis memory...'
    npx ttab -t 'REDIS-CLI' redis-cli SHUTDOWN
    sleep 2
    redis-cli FLUSHALL
    sleep 2

    echo 'spining up a fresh redis server...'
    npx ttab -t 'REDIS' redis-server
    sleep 2
fi


venvCmd=""
if [ ! -z "$venv" ]
then
   echo "virtualenv path is provided, will use: ${venv}";
   venvCmd="source ${venv}/bin/activate &&"
   echo "venv cmd: ${venvCmd}"
fi
CWD="$PWD"

FILE=$HOME/.flojoy/flojoy.yaml
if test -f "$FILE"; then
   touch $HOME/.flojoy/flojoy.yaml
   echo "PATH: $CWD" > $HOME/.flojoy/flojoy.yaml
   echo "$FILE exists."
else
   mkdir $HOME/.flojoy && touch $HOME/.flojoy/flojoy.yaml
   echo "PATH: $CWD" > $HOME/.flojoy/flojoy.yaml
   echo "directory ~/.flojoy/flojoy.yaml does not exists. Creating new directory with yaml file."
fi

echo 'starting redis worker for flojoy-watch'
npx ttab -t 'Flojoy-watch RQ Worker' "${venvCmd} export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES && rq worker flojoy-watch"

echo 'starting redis worker for nodes...'
npx ttab -t 'RQ WORKER' "${venvCmd} cd PYTHON && export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES && rq worker flojoy"

echo 'starting django server...'
npx ttab -t 'Django' "${venvCmd} python3 manage.py runserver"
sleep 1

echo 'starting react server...'
npx ttab -t 'REACT' "${venvCmd} npm start"