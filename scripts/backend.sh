#!/bin/sh

current_dir="$(dirname "$(readlink -f "$0")")"

flojoy_dir="$HOME/.flojoy"
venv_name="404fc545_flojoy"
venv_dir="$flojoy_dir/flojoy_root_venv"
venv_path="$flojoy_dir/flojoy_root_venv/$venv_name"


if [ ! -d "$flojoy_dir" ]; then
  mkdir "$flojoy_dir"
fi
cd $flojoy_dir
if [ ! -d "$venv_dir" ]; then
  mkdir "$venv_dir"
fi
cd $venv_dir
if [ ! -d "$venv_path" ]; then
  python3 -m venv "$venv_name"
fi
cd $venv_path
source $venv_name/bin/activate
cd $current_dir
python3 -m pip install -r requirements.txt

python3 manage.py

