#!/bin/bash

current_dir="$(dirname "$(readlink -f "$0")")"

flojoy_dir="$HOME/.flojoy"
mamba_dir="$flojoy_dir/python"
python_exec="$mamba_dir/bin/python3"
venv_name="404fc545_flojoy"
venv_dir="$flojoy_dir/flojoy_root_venv"
venv_path="$venv_dir/$venv_name"

if [ "$(uname)" == "Darwin" ]; then
  # if [ "$(uname -m)" == "x86_64" ]; then
    mamba_installer="$current_dir/mamba/mamba_mac_x86_64.sh"
  # fi
elif [ "$(uname)" == "Linux" ]; then
  mamba_installer="$current_dir/mamba/mamba_linux_x86_64.sh"
else
  echo "Unsupported operating system"
fi

echo "flojoy dir: $flojoy_dir"

if [ ! -d "$flojoy_dir" ]; then
  echo "Flojoy directory doesn't exist, Creating $flojoy_dir ... "
  mkdir "$flojoy_dir"
fi

if [ ! -f "$python_exec" ]; then
  if [ -d "$mamba_dir" ]; then
    rm -rf $mamba_dir
  fi
  echo "Installing mamba to local directory..."
  # Extract the zip file to the destination directory
  $mamba_installer -b
fi

cd "$flojoy_dir"
echo "Location set to $flojoy_dir"
if [ ! -d "$venv_dir" ]; then
  echo "$venv_dir doesn't exist.."
  mkdir "$venv_dir"
  echo "Created virtual env directory: $venv_dir"
fi
cd "$venv_dir"
echo "location set to $venv_dir"
if [ ! -d "$venv_path" ]; then
  echo "Virtual env not found, creating a virtual env at $venv_dir"
  $python_exec -m venv $venv_name
fi
source $venv_name/bin/activate
echo "Virtual env: $venv_name is activated!"
cd "$current_dir"
echo "Installing pip dependencies..."
pip install -r requirements.txt
echo "Package installation completed, starting backend..."
export ELECTRON_MODE=packaged
python manage.py
