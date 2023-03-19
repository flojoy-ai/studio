#!/bin/bash
alias venv="source $HOME/venv/bin/activate"
djangoPort=8000
node_branch="main"
apps_branch="main"

helpFunction()
{
   echo ""
   echo "Usage: $0 -n -p -r -v venv-path"
   echo -r "shuts down existing redis server and spins up a fresh one"
   echo -v "path to a virtualenv"
   echo -n "installs npm packages"
   echo -p "installs python packages"
   echo -b1 "pulls the latest changes in the given branch from APPS submodule"
   echo -b2 "pulls the latest changes in the given branch from NODES submodule"
   exit 1 # Exit script after printing help
}

while getopts "rv:npP:b1:b2:" opt
do
   echo $opt
   case "$opt" in
      P) djangoPort="$OPTARG";;
      p) initPythonPackages=true;;
      n) initNodePackages=true;;
      r) initRedis=true ;;
      v) venv="$OPTARG" ;;
      b1) apps_branch="$OPTARG" ;;
      b2) node_branch="$OPTARG" ;;
      ?) helpFunction ;; # Print helpFunction in case parameter is non-existent
   esac
done

bash git_start_up.sh $apps_branch $node_branch

# echo 'update ES6 status codes file...'
# python3 -c 'import yaml, json; f=open("src/STATUS_CODES.json", "w"); f.write(json.dumps(yaml.safe_load(open("STATUS_CODES.yml").read()), indent=4)); f.close();'

# echo 'create symlinks...'
# ln STATUS_CODES.yml PYTHON/WATCH/
# ln STATUS_CODES.yml src

# echo 'jsonify python functions and write to JS-readable directory'
# python3 write_python_metadata.py

# echo 'generate manifest for python nodes to frontend'
# python3 generate_manifest.py

# if [ $initNodePackages ]
# then
#    echo '-n flag provided'
#    echo 'Node packages will be installed from package.json!'
#    npm install --legacy-peer-deps
# fi


# if [ $initRedis ]
# then
#     echo 'shutting down any existing redis server and clearing redis memory...'
#     npx ttab -t 'REDIS-CLI' redis-cli SHUTDOWN
#     sleep 2
#     redis-cli FLUSHALL
#     sleep 2

#     echo 'spining up a fresh redis server...'
#     npx ttab -t 'REDIS' redis-server
#     sleep 2
# fi

# venvCmd=""
# if [ ! -z "$venv" ]
# then
#    echo "virtualenv path is provided, will use: ${venv}";
#    venvCmd="source ${venv}/bin/activate &&"
#    echo "venv cmd: ${venvCmd}"
# fi

# CWD="$PWD"

# FILE=$HOME/.flojoy/flojoy.yaml
# if test -f "$FILE"; then
#    touch $HOME/.flojoy/flojoy.yaml
#    echo "PATH: $CWD" > $HOME/.flojoy/flojoy.yaml
#    echo "$FILE exists."
# else
#    mkdir $HOME/.flojoy && touch $HOME/.flojoy/flojoy.yaml
#    echo "PATH: $CWD" > $HOME/.flojoy/flojoy.yaml
#    echo "directory ~/.flojoy/flojoy.yaml does not exists. Creating new directory with yaml file."
# fi

# echo 'closing all existing rq workers (if any)'
# python3 close-all-rq-workers.py
# echo 'rq info after closing:'
# rq info

# echo 'starting redis worker for flojoy-watch'
# npx ttab -t 'Flojoy-watch RQ Worker' "${venvCmd} export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES && rq worker flojoy-watch"

# echo 'starting redis worker for nodes...'
# npx ttab -t 'RQ WORKER' "${venvCmd} cd PYTHON && export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES && rq worker flojoy"

# if [ $initPythonPackages ]
# then
#    echo '-p flag provided'
#    echo 'Python packages will be installed from requirements.txt file!'
#    if lsof -Pi :$djangoPort -sTCP:LISTEN -t >/dev/null ; then
#       djangoPort=$((djangoPort + 1))
#       echo "A server is already running on $((djangoPort - 1)), starting Django server on port ${djangoPort}..."
#       npx ttab -t 'Django' "${venvCmd} pip install -r requirements.txt && python3 write_port_to_env.py $djangoPort && python3 manage.py runserver ${djangoPort}"
#    else
#       echo "starting django server on port ${djangoPort}..."
#       npx ttab -t 'Django' "${venvCmd} pip install -r requirements.txt && python3 write_port_to_env.py $djangoPort && python3 manage.py runserver ${djangoPort}"
#    fi
# else
#    if lsof -Pi :$djangoPort -sTCP:LISTEN -t >/dev/null ; then
#       djangoPort=$((djangoPort + 1))
#       echo "A server is already running on $((djangoPort - 1)), starting Django server on port ${djangoPort}..."
#       npx ttab -t 'Django' "${venvCmd} python3 write_port_to_env.py $djangoPort && python3 manage.py runserver ${djangoPort}"
#    else
#       echo "starting django server on port ${djangoPort}..."
#       npx ttab -t 'Django' "${venvCmd} python3 write_port_to_env.py $djangoPort && python3 manage.py runserver ${djangoPort}"
#    fi
# fi

# CWD="$PWD"

# FILE=$PWD/PYTHON/utils/object_detection/yolov3.weights
# if test -f "$FILE"; then
#    echo "$FILE exists."
# else
#    touch $PWD/PYTHON/utils/object_detection/yolov3.weights
#    wget -O $PWD/PYTHON/utils/object_detection/yolov3.weights https://pjreddie.com/media/files/yolov3.weights
# fi

# sleep 1

# echo 'starting react server...'
# npx ttab -t 'REACT' "${venvCmd} npm start"