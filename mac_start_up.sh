ias venv="source $HOME/venv/bin/activate"
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
python jsonify_funk.py

echo 'generate manifest for python nodes to frontend'
python3 generate_manifest.py

if [ $initRedis ]
then
    echo 'shutting down any existing redis server and clearing redis memory...'
    ttab -t 'REDIS-CLI' redis-cli SHUTDOWN
    sleep 2
    redis-cli FLUSHALL
    sleep 2

    echo 'spining up a fresh redis server...'
    ttab -t 'REDIS' redis-server
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
    echo "$FILE exists."
else
   cd $HOME && mkdir .flojoy && touch .flojoy/flojoy.yaml
   echo "PATH=$CWD" > .flojoy/flojoy.yaml
   echo "Error: Directory .flojoy/flojoy.yaml does not exists. creating new directory with yaml file."
fi
echo 'starting redis worker...'
npx ttab -t 'RQ WORKER' "${venvCmd} cd PYTHON && rq worker flojoy"

echo 'starting node server...'
npx ttab -t 'NODE' "${venvCmd} node server.js"
sleep 1

echo 'starting react server...'
npx ttab -t 'REACT' "${venvCmd} npm start"