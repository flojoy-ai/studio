info_msg() {
	message=$1
	echo ":info: $message"
}
feedback() {
	is_successful=$1
	message=$2
	help_message=$3
	if [ "$is_successful" -eq 0 ]; then
		info_msg "$message"
	else
		echo "$help_message"
		exit 1
	fi
}
current_dir="$(dirname "$(readlink -f "$0")")"

flojoy_env="flojoy-studio"
env_yml="$current_dir/environment.yml"
conda_script="$current_dir/conda_install.sh"

# Need to source them because the "conda" command is actually a bash function
if [ -f ~/.zshrc ]; then
	source ~/.zshrc
	info_msg "Sourced ~/.zshrc"
fi

if [ -f ~/.bashrc ]; then
	source ~/.bashrc
	info_msg "Sourced ~/.bashrc"
fi
info_msg "Looking for conda installation..."
if ! command -v conda &>/dev/null; then
	info_msg "Conda installation was not found..."
	bash $conda_script
	if [ -f ~/.zshrc ]; then
		source ~/.zshrc
		info_msg "Sourced ~/.zshrc"
	fi

	if [ -f ~/.bashrc ]; then
		source ~/.bashrc
		info_msg "Sourced ~/.bashrc"
	fi
else
	info_msg "Conda is already installed..."
fi

eval "$(conda shell.bash hook)" # configure the shell properly

cd $current_dir

# Bootstrapping using conda
conda activate $flojoy_env
# Check if the Conda environment exists
if [ $? -eq 0 ]; then
	info_msg "$flojoy_env env found!"
	if ! test -f "$current_dir/.updated_env"; then
		info_msg "Updating $flojoy_env env..."
		# Environment exists, update it
		conda env update --file $env_yml --name $flojoy_env
		conda activate $flojoy_env
		touch "$current_dir/.updated_env"
	fi
else
	# Environment doesn't exist, create it
	conda env create --file $env_yml --name $flojoy_env
	conda activate $flojoy_env
	touch "$current_dir/.updated_env"
fi

if ! test -f "$current_dir/.installed_deps"; then
	info_msg "Installing python deps... It may take up to few minutes for the first time.. hang tight!"
	poetry install
	feedback $? "Installed packages successfully!" "Error occured while installing packages with poetry!"
	touch "$current_dir/.installed_deps"
fi
export ELECTRON_MODE=packaged
info_msg "Starting backend..."
poetry run python3 manage.py
