feedback() {
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

# Need to source them because the "conda" command is actually a bash function
if [ -f ~/.zshrc ]; then
	source ~/.zshrc
	echo "Sourced ~/.zshrc"
fi

if [ -f ~/.bashrc ]; then
	source ~/.bashrc
	echo "Sourced ~/.bashrc"
fi

current_dir="$(dirname "$(readlink -f "$0")")"

# Creating the .flojoy folder
flojoy_dir="$HOME/.flojoy"
echo "flojoy dir: $flojoy_dir"

if [ ! -d "$flojoy_dir" ]; then
	echo "Flojoy directory doesn't exist, Creating $flojoy_dir ... "
	mkdir "$flojoy_dir"
fi

eval "$(conda shell.bash hook)" # configure the shell properly
conda --version

if [ ! $? -eq 0 ]; then
	echo "Conda is not installed on your system."
	echo "Please install Conda before proceeding."
	exit 1
fi

cd $current_dir

# Bootstrapping using conda
ENV_NAME="flojoy-studio"
YAML_FILE="environment.yml"

conda activate $ENV_NAME
# Check if the Conda environment exists
if [ $? -eq 0 ]; then
	# Environment exists, update it
	conda env update --file $YAML_FILE --name $ENV_NAME
else
	# Environment doesn't exist, create it
	conda env create --file $YAML_FILE --name $ENV_NAME
	conda activate $ENV_NAME
fi

export ELECTRON_MODE=packaged
poetry install
poetry run python3 manage.py
