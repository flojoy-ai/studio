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
shell_path="$SHELL"
running_shell=$(basename "$shell_path")

source_bash_zsh() {
	echo "Running shell is $running_shell"
	if [[ "$running_shell" == "zsh" ]]; then
		source ~/.zshrc
		info_msg "Sourced ~/.zshrc"
	else
		source ~/.bashrc
		info_msg "Sourced ~/.bashrc"
	fi
}

init_shell() {
	if [[ "$running_shell" == "zsh" ]]; then
		eval "$(conda shell.zsh hook)"
	else
		eval "$(conda shell.bash hook)"
	fi
}

enable_libmamba() {
	# Get solver from config
	solver=$(conda config --show solver 2>/dev/null)
	# Check if "libmamba" is there as solver
	if [[ "$solver" == *"libmamba"* ]]; then
		info_msg "Libmamba is already set as solver for conda."
	else
		info_msg "Updating Conda and configuring libmamba as the solver."
		conda update -n base conda -y >/dev/null 2>&1
		conda install -n base conda-libmamba-solver -y >/dev/null 2>&1
		conda config --set solver libmamba >/dev/null 2>&1
		feedback $? "Libmamba is set as solver for conda..." "Failed to set libmamba as solver for conda!"
	fi
}

current_dir="$(dirname "$(readlink -f "$0")")"

flojoy_env="flojoy-studio"
env_yml="$current_dir/environment.yml"
conda_script="$current_dir/conda_install.sh"

# Need to source them because the "conda" command is actually a bash function
source_bash_zsh

info_msg "Looking for conda installation..."
if ! command -v conda &>/dev/null; then
	info_msg "Conda installation was not found..."
	bash "$conda_script"
	source_bash_zsh
else
	info_msg "Conda is already installed..."
fi

init_shell # configure the shell properly

enable_libmamba

cd "$current_dir" || exit

# Bootstrapping using conda

# Check if the Conda environment exists
if conda activate $flojoy_env; then
	info_msg "$flojoy_env env found!"
	if ! test -f "$current_dir/.updated_env"; then
		info_msg "Updating $flojoy_env env..."
		# Environment exists, update it
		conda env update --file "$env_yml" --name $flojoy_env
		conda activate $flojoy_env
		touch "$current_dir/.updated_env"
	fi
else
	# Environment doesn't exist, create it
	info_msg "Creating $flojoy_env env with conda..."
	conda env create --file "$env_yml" --name $flojoy_env
	conda activate $flojoy_env
	info_msg "Activated $flojoy_env env."
	touch "$current_dir/.updated_env"
fi

if ! test -f "$current_dir/.installed_deps"; then
	info_msg "Installing python deps... It may take up to few minutes for the first time.. hang tight!"
	poetry install
	feedback $? "Installed packages successfully!" "Error occurred while installing packages with poetry!"
	touch "$current_dir/.installed_deps"
fi
export ELECTRON_MODE=packaged
info_msg "Starting backend..."
poetry run python3 manage.py
