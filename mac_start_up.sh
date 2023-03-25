#!/bin/sh
gum style \
	--foreground 212 --border-foreground 212 --border double \
	--align center --width 60 --margin "1 2" --padding "2 4" \
	'Welcome to Flojoy!' 'For Installation, Follow the Link Below' 'https://docs.flojoy.io/getting-started/install/'

alias venv="source $HOME/venv/bin/activate"
djangoPort=8000
initNodePackages=true
initPythonPackages=true

helpFunction()
{
   gum style --foreground 57 ""
   gum style --foreground 57 "Usage: $0 -n -p -r -v venv-path"
   gum style --foreground 57  " -r: shuts down existing redis server and spins up a fresh one"
   gum style --foreground 57  " -v: path to a virtualenv"
   gum style --foreground 57  " -n: To not install npm packages"
   gum style --foreground 57  " -p: To not install python packages"
   gum style --foreground 57 1 # Exit script after printing help
}

# Parse command-line arguments
while [ $# -gt 0 ]
do
    key="$1"
    case $key in
        -n)
        initNodePackages=false
        shift
        ;;
        -p)
        initPythonPackages=false
        shift
        ;;
        -r)
        initRedis=true
        shift
        ;;
        -v)
        venv="$2"
        shift
        shift
        ;;
        -P)
        djangoPort="$2"
        shift
        shift
        ;;
        *) # unknown option
        gum style --foreground 57 "Unknown option: $1"
        helpFunction
        exit 1
        ;;
    esac
done

gum spin --spinner dot --title 'update ES6 status codes file...' -- python3 -c 'import yaml, json; f=open("src/STATUS_CODES.json", "w"); f.write(json.dumps(yaml.safe_load(open("STATUS_CODES.yml").read()), indent=4)); f.close();'
gum style --foreground 212 ':heavy_check_mark: update update ES6 status codes file ...' | gum format -t emoji

gum spin --spinner dot --title 'create symlinks...' -- sleep 1
FILE=$PWD/PYTHON/WATCH/STATUS_CODES.yml
if test -f "$FILE"; then
   gum style --foreground 57 ":point_right: $FILE exists." | gum format -t emoji
else
   ln STATUS_CODES.yml PYTHON/WATCH/
fi

FILE=$PWD/src/STATUS_CODES.yml
if test -f "$FILE"; then
   gum style --foreground 57 ":point_right: $FILE exists." | gum format -t emoji
else
   ln STATUS_CODES.yml src
fi
gum style --foreground 212 ':heavy_check_mark: create symlinks...' | gum format -t emoji

gum spin --spinner dot --title 'jsonify python functions and write to JS-readable directory' -- python3 write_python_metadata.py
gum style --foreground 212 ':heavy_check_mark: jsonify python functions and write to JS-readable directory' | gum format -t emoji

gum spin --spinner dot --title 'generate manifest for python nodes to frontend' -- python3 generate_manifest.py
gum style --foreground 212 ':heavy_check_mark: generate manifest for python nodes to frontend' | gum format -t emoji

if [ $initNodePackages = true ]
then
   gum style --foreground 86 ' -n flag is not provided'
   gum spin --spinner dot --title 'Node packages will be installed from package.json!' -- npm install --legacy-peer-deps
   gum style --foreground 212 ':heavy_check_mark: Node packages will be installed from package.json!' | gum format -t emoji
fi


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

# if [ $initPythonPackages = true ]
# then
#    echo '-p flag is not provided'
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