#!/bin/bash

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
  cmd=""$mamba_executable" create -n $venv_name conda-forge::python=3.10 -r $mamba_dir -y"
  $cmd
  if [ "$?" -eq 0 ]; then
      echo "Micromamba env $venv_name created successfully."
  else
    echo "Micromamba env creation failed."
    exit 1
  fi
fi

if [ $platform == "Linux" ]; then
  # Linux/bash:
  eval "$("$mamba_executable" shell hook --shell bash)"
  # sourcing the bashrc file incorporates the changes into the running session.
  # better yet, restart your terminal!
  source ~/.bashrc
elif [ $platform == "Darwin" ]; then
  # macOS/zsh:
  eval "$("$mamba_executable" shell hook --shell zsh)"
  source ~/.zshrc
fi
export MAMBA_ROOT_PREFIX=$mamba_dir
micromamba activate $venv_name
echo "Env $venv_name is activated!"
cd "$current_dir"
echo "Installing pip dependencies..."
pip install -r requirements.txt
echo "Package installation completed, starting backend..."
export ELECTRON_MODE=packaged
python manage.py
