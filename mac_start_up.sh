#!/bin/sh
success_color=71
warning_color=3
error_color=52
message_color=61
general_color=212
ok_emoji=':heavy_check_mark:'
not_ok_emoji=':x:'

is_command_successful=0

gum style \
	--foreground $general_color --border-foreground 212 --border double \
	--align center --width 60 --margin "1 2" --padding "2 4" \
	'Welcome to Flojoy!' 'For Installation, Follow the Link Below' 'https://docs.flojoy.io/getting-started/install/'


alias venv="source $HOME/venv/bin/activate"
djangoPort=8000
initNodePackages=true
initPythonPackages=true

feedback()
{
   is_successful=$1
   message=$2
   help_message=$3
   if [ $is_successful -eq 0 ]; then
      gum style --foreground $success_color ":heavy_check_mark: $message" | gum format -t emoji
   else
      gum style --foreground $error_color ":x: $message : $help_message" | gum format -t emoji
      exit
   fi
}

spinner()
{
   title=$1
   commands=$2
   echo $commands
   if [ "$(type -t $commands)" = "function" ]; then
    gum spin --spinner dot --title "$title" --title.foreground="$general_color" -- $commands
   else
      echo "here"
      gum spin --spinner dot --title "$title" --title.foreground="$general_color" -- sleep 2
      echo $?
   fi
}

createSystemLinks()
{

   FILE=$PWD/PYTHON/WATCH/STATUS_CODES.yml
   if test -f "$FILE"; then
      gum style --foreground $warning_color ":point_right: $FILE exists." | gum format -t emoji
      is_command_successful=$(($is_command_successful+$?))
   else
      ln STATUS_CODES.yml PYTHON/WATCH/
      is_command_successful=$(($is_command_successful+$?))
   fi

   FILE=$PWD/src/STATUS_CODES.yml
   if test -f "$FILE"; then
      gum style --foreground $warning_color ":point_right: $FILE exists." | gum format -t emoji
      is_command_successful=$(($is_command_successful+$?))
   else
      ln STATUS_CODES.yml src
      is_command_successful=$(($is_command_successful+$?))
   fi
}

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

feedback $? 'update ES6 status codes file...' 'check your python version, we use python3.10 in our project'

gum spin --spinner dot --title 'create symlinks...' --title.foreground="$general_color" -- sleep 2 && createSystemLinks

feedback $is_command_successful 'create symlinks...' 'check your PYTHON/WATCH or src folder, maybe one of them is missing'

gum spin --spinner dot --title 'jsonify python functions and write to JS-readable directory' --title.foreground="$general_color" -- python3 write_python_metadata.py

feedback $? 'jsonify python functions and write to JS-readable directory' 'check write_python_metadata.py file, maybe the folders mentioned in the file, one of is missing or check your python version, we use 3.10 or later version in our project'


gum spin --spinner dot --title 'generate manifest for python nodes to frontend' --title.foreground="$general_color" -- python3 generate_manifest.py

feedback $? 'generate manifest for python nodes to frontend' 'check generate_manifest.py file, maybe the folders mentioned in the file, one of is missing or check your python version, we use 3.10 or later version in our project'

if [ $initNodePackages = true ]
then
   gum style --foreground $message_color ' -n flag is not provided'

   gum spin --spinner dot --title 'Node packages will be installed from package.json!' --title.foreground="$general_color" -- npm install --legacy-peer-deps

   feedback $? 'Node packages will be installed from package.json!' 'check if npm is installed in your local machine'
fi

if [ $initRedis ]
then

   gum spin --spinner dot --title 'shutting down any existing redis server and clearing redis memory...' --title.foreground="$general_color" -- npx ttab -t 'REDIS-CLI' "redis-cli SHUTDOWN;sleep 2;redis-cli FLUSHALL;exit"

   feedback 'shutting down any existing redis server and clearing redis memory...' 'redis-cli error: check if redis-cli is running or redis is installed in your local machine'

   gum spin --spinner dot --title 'spining up a fresh redis server...' --title.foreground="$general_color" -- npx ttab -t 'REDIS-CLI' "redis-server;sleep 2;exit"

   feedback 'spining up a fresh redis server...' 'try closing and restarting the redis server'
fi

venvCmd=""
if [ ! -z "$venv" ]
then
   gum style --foreground $warning_color ":point_right: virtualenv path is provided, will use: ${venv}" | gum format -t emoji
   venvCmd="source ${venv}/bin/activate"
   gum style --foreground $warning_color ":point_right: venv cmd: ${venvCmd}" | gum format -t emoji
fi

CWD="$PWD"

FILE=$HOME/.flojoy/flojoy.yaml
if test -f "$FILE"; then
   touch $HOME/.flojoy/flojoy.yaml
   echo "PATH: $CWD" > $HOME/.flojoy/flojoy.yaml
   gum style --foreground $warning_color ":point_right: $FILE exists." | gum format -t emoji
else
   gum style --foreground $warning_color ":point_right: directory ~/.flojoy/flojoy.yaml does not exists. Creating new directory with yaml file." | gum format -t emoji

   mkdir $HOME/.flojoy && touch $HOME/.flojoy/flojoy.yaml

   is_command_successful=$?

   echo "PATH: $CWD" > $HOME/.flojoy/flojoy.yaml

   is_command_successful=$(($is_command_successful+$?))

   feedback $is_command_successful 'Creating new directory with yaml file.' 'failed to create file in the home directory, check the permission or sign in as root user'
fi

gum spin --spinner dot --title 'closing all existing rq workers (if any)' --title.foreground="$general_color" -- python3 close-all-rq-workers.py

feedback $? 'closing all existing rq workers (if any)' 'failed to close rq worker, check if rq worker is installed in python packages or run the commands without -p argument'

gum style --foreground $warning_color 'rq info after closing:'
rq info

gum spin --spinner dot --title 'starting redis worker for flojoy-watch' --title.foreground="$general_color" -- npx ttab -t 'Flojoy-watch RQ Worker' "gum style --foreground $general_color 'Welcome to Flojoy-Watch, RQ WORKER QUEUE! :wave: ' '' 'Here you can monitor LOGS of the Jobsets, queued by our scheduler' '' | gum format -t emoji;${venvCmd} && export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES && rq worker flojoy-watch"

feedback $? 'starting redis worker for flojoy-watch' 'check if ttab is installed ( npx ttab) or check if rq worker is installed in your python package'

gum spin --spinner dot --title 'starting redis worker for nodes...' --title.foreground="$general_color" -- npx ttab -t 'RQ WORKER' "gum style --foreground $general_color 'Welcome to Flojoy RQ WORKER QUEUE! :wave: ' '' 'Here you can monitor LOGS of the Jobs, queued By Flojoy-Watch Worker' '' | gum format -t emoji;${venvCmd} && cd PYTHON && export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES && rq worker flojoy"

if [ $initPythonPackages = true ]
then
   gum style --foreground $warning_color ":point_right: -p flag is not provided, python packages will be installed using" | gum format -t emoji

   # feedback $is_command_successful 'Python packages will be installed from requirements.txt file!' 'Check your virtual environment path as well as pip version'

   if lsof -Pi :$djangoPort -sTCP:LISTEN -t >/dev/null ; then
      djangoPort=$((djangoPort + 1))

      gum spin --spinner dot --title 'A server is already running on $((djangoPort - 1)), starting Django server on port ${djangoPort}...' --title.foreground="$general_color" -- npx ttab -t 'Django' "${venvCmd} && pip install -r requirements.txt && python3 write_port_to_env.py $djangoPort && python3 manage.py runserver ${djangoPort}"

   else

      gum spin --spinner dot --title 'starting django server on port ${djangoPort}...' --title.foreground="$general_color" -- npx ttab -t 'Django' "${venvCmd} && pip install -r requirements.txt && python3 write_port_to_env.py $djangoPort && python3 manage.py runserver ${djangoPort}"

   fi
else
   if lsof -Pi :$djangoPort -sTCP:LISTEN -t >/dev/null ; then
      djangoPort=$((djangoPort + 1))
      echo "A server is already running on $((djangoPort - 1)), starting Django server on port ${djangoPort}..."
      npx ttab -t 'Django' "${venvCmd} python3 write_port_to_env.py $djangoPort && python3 manage.py runserver ${djangoPort}"
   else
      echo "starting django server on port ${djangoPort}..."
      npx ttab -t 'Django' "${venvCmd} python3 write_port_to_env.py $djangoPort && python3 manage.py runserver ${djangoPort}"
   fi
fi
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