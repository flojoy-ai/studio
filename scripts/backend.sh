#!/bin/bash

current_dir="$(dirname "$(readlink -f "$0")")"

flojoy_dir="$HOME/.flojoy"
venv_name="404fc545_flojoy"
venv_dir="$flojoy_dir/flojoy_root_venv"
venv_path="$flojoy_dir/flojoy_root_venv/$venv_name"



py_missing="Python version ^3.10 was not found on your system. Please install it or set default Python environment to ^3.10 and rerun the app. You can download the specific version from the official website: https://www.python.org/downloads/"
pip_missing="Pip was not found. Pip version 20.0 or higher is required for this project. You can find guidelines on this here: https://packaging.python.org/en/latest/tutorials/installing-packages/#ensure-you-can-run-pip-from-the-command-line"
npm_missing="Node.js/npm was not found. Please make sure you have installed Node.js version 16.0 or higher along with npm correctly. You can download Nodejs from here: https://nodejs.org/en/download"

if [[ "$OSTYPE" == "darwin"* || "$OSTYPE" == "linux-gnu"*  ]]; then
  if command -v python3 &> /dev/null; then
      if ! python3 -c "import sys; exit(0) if sys.version_info >= (3,10) and sys.version_info < (3,11) else exit(1)" &>/dev/null; then
          echo "$py_missing"
          exit 1
      fi
  else 
    echo "$py_missing"
    exit 1
  fi

  if ! command -v python3 -m pip &> /dev/null; then
    echo "$pip_missing"
    exit 1
  fi

  MINIMUM_PIP_VERSION="20.0"
  PIP_VERSION=$(python3 -m pip --version | awk '{print $2}')

  if ! awk 'BEGIN{exit !('$PIP_VERSION' >= '$MINIMUM_PIP_VERSION')}'; then
    echo "An older version of pip was found. Pip version 20.0 or higher is required for this project. To upgrade run following command: 'pip install --upgrade pip' or 'python3 -m pip install --upgrade pip'"
    exit 1
  fi


  if ! command -v npm &> /dev/null; then
    echo "$npm_missing"
    exit 1
  fi

fi

echo "flojoy dir: $flojoy_dir"

if [ ! -d "$flojoy_dir" ]; then
  echo "Flojoy directory doesn't exist, Creating $flojoy_dir ... "
  mkdir "$flojoy_dir"
fi
cd "$flojoy_dir"
echo "Location set to $flojoy_dir"
if [ ! -d "$venv_dir" ]; then
  echo "$venv_dir doesn't exist.."
  mkdir "$venv_dir"
  echo "Created virtual env directory: $venv_dir"
fi
cd "$venv_dir"
if [ ! -d "$venv_path" ]; then
  echo "Virtual env not found, creating a virtual env at $venv_dir"
  python3 -m venv "$venv_name"
fi

source "$venv_name/bin/activate"
echo "Virtual env $venv_name is activated!"

cd "$current_dir"
echo "Installing pip dependencies..."
python3 -m pip install -r requirements.txt
echo "Package installation completed, starting backend..."
export ELECTRON_MODE=packaged
python3 manage.py

