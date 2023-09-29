#!/bin/bash

feedback()
{
   is_successful=$1
   message=$2
   help_message=$3
   if [ "$is_successful" -eq 0 ]; then
      echo "$message"
   else
      echo "$help_message"
      exit 1
   fi
}

current_dir="$(dirname "$(readlink -f "$0")")"

flojoy_dir="$HOME/.flojoy"
mamba_dir="$flojoy_dir/mamba"
python_exec="$mamba_dir/bin/python3"
venv_name="flojoy_root"
venv_dir="$mamba_dir/envs/$venv_name"
venv_executable="$venv_dir/bin/python"
platform=$(uname)
arch=$(uname -m)
mamba_executable="$current_dir/bin/micromamba-$platform-$arch"

echo "flojoy dir: $flojoy_dir"

if [ ! -d "$flojoy_dir" ]; then
  echo "Flojoy directory doesn't exist, Creating $flojoy_dir ... "
  mkdir "$flojoy_dir"
fi

cd "$flojoy_dir"
echo "Location set to $flojoy_dir"

if [ ! -f "$venv_executable" ]; then
  if [ -d "$venv_dir" ]; then
    rm -rf "$venv_dir"
  fi
  echo "Creating micromamba env..."
  "$mamba_executable" create -n $venv_name conda-forge::python=3.10 -r $mamba_dir -y
  feedback $? "Micromamba env $venv_name created successfully." "Micromamba env creation failed."
fi

if [ $platform == "Linux" ]; then
  eval "$("$mamba_executable" shell hook --shell bash)"
elif [ $platform == "Darwin" ]; then
  eval "$("$mamba_executable" shell hook --shell zsh)"
fi
export MAMBA_ROOT_PREFIX=$mamba_dir
micromamba activate $venv_name
feedback $? "Env $venv_name is activated!" "Failed to activate $venv_name env!"
cd "$current_dir"
echo "Installing pip dependencies..."
pip install -r requirements.txt
echo "Package installation completed, starting backend..."
export ELECTRON_MODE=packaged
python manage.py
