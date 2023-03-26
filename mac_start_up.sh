#!/bin/sh
success_color=71
warning_color=3
error_color=92
message_color=61
general_color=212

gum style \
	--foreground $general_color --border-foreground 212 --border double \
	--align center --width 60 --margin "1 2" --padding "2 4" \
	'Welcome to Flojoy!' 'For Installation, Follow the Link Below' 'https://docs.flojoy.io/getting-started/install/'

alias venv="source $HOME/venv/bin/activate"
djangoPort=8000
initNodePackages=true
initPythonPackages=true

helpFunction()
{
   gum style --foreground $message_color ""
   gum style --foreground $message_color "Usage: $0 -n -p -r -v venv-path"
   gum style --foreground $message_color  " -r: shuts down existing redis server and spins up a fresh one"
   gum style --foreground $message_color  " -v: path to a virtualenv"
   gum style --foreground $message_color  " -n: To not install npm packages"
   gum style --foreground $message_color  " -p: To not install python packages"
   gum style --foreground $message_color 1 # Exit script after printing help
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
        gum style --foreground $message_color "Unknown option: $1"
        helpFunction
        exit 1
        ;;
    esac
done

gum spin --spinner dot --title 'update ES6 status codes file...' --title.foreground="$general_color" -- python3 -c 'import yaml, json; f=open("src/STATUS_CODES.json", "w"); f.write(json.dumps(yaml.safe_load(open("STATUS_CODES.yml").read()), indent=4)); f.close();'
gum style --foreground $success_color ':heavy_check_mark: update update ES6 status codes file ...' | gum format -t emoji

gum spin --spinner dot --title 'create symlinks...' --title.foreground="$general_color" -- sleep 1
FILE=$PWD/PYTHON/WATCH/STATUS_CODES.yml
if test -f "$FILE"; then
   gum style --foreground $warning_color ":point_right: $FILE exists." | gum format -t emoji
else
   ln STATUS_CODES.yml PYTHON/WATCH/
fi

FILE=$PWD/src/STATUS_CODES.yml
if test -f "$FILE"; then
   gum style --foreground $warning_color ":point_right: $FILE exists." | gum format -t emoji
else
   ln STATUS_CODES.yml src
fi
gum style --foreground $success_color ':heavy_check_mark: create symlinks...' | gum format -t emoji

gum spin --spinner dot --title 'jsonify python functions and write to JS-readable directory' --title.foreground="$general_color" -- python3 write_python_metadata.py
gum style --foreground $success_color ':heavy_check_mark: jsonify python functions and write to JS-readable directory' | gum format -t emoji

gum spin --spinner dot --title 'generate manifest for python nodes to frontend' --title.foreground="$general_color" -- python3 generate_manifest.py
gum style --foreground $success_color ':heavy_check_mark: generate manifest for python nodes to frontend' | gum format -t emoji

if [ $initNodePackages = true ]
then
   gum style --foreground $message_color ' -n flag is not provided'
   gum spin --spinner dot --title 'Node packages will be installed from package.json!' --title.foreground="$general_color" -- npm install --legacy-peer-deps
   gum style --foreground $success_color ':heavy_check_mark: Node packages will be installed from package.json!' | gum format -t emoji
fi


if [ $initRedis ]
then

   gum spin --spinner dot --title 'shutting down any existing redis server and clearing redis memory...' --title.foreground="$general_color" -- npx ttab -t 'REDIS-CLI' "redis-cli SHUTDOWN;sleep 2;redis-cli FLUSHALL;exit"

   gum style --foreground $success_color ':heavy_check_mark: shutting down any existing redis server and clearing redis memory...' | gum format -t emoji

   gum spin --spinner dot --title 'spining up a fresh redis server...' --title.foreground="$general_color" -- npx ttab -t 'REDIS-CLI' "redis-server;sleep 2;exit"

   gum style --foreground $success_color ':heavy_check_mark: spining up a fresh redis server...' | gum format -t emoji
fi

venvCmd=""
if [ ! -z "$venv" ]
then
   gum style --foreground $warning_color ":point_right: virtualenv path is provided, will use: ${venv}" | gum format -t emoji
   venvCmd="source ${venv}/bin/activate &&"
   gum style --foreground $warning_color ":point_right: venv cmd: ${venvCmd}" | gum format -t emoji
fi

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