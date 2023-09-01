#!/bin/bash

current_dir="$(dirname "$(readlink -f "$0")")"

flojoy_dir="$HOME/.flojoy"
venv_name="404fc545_flojoy"
venv_dir="$flojoy_dir/flojoy_root_venv"
venv_path="$flojoy_dir/flojoy_root_venv/$venv_name"

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

