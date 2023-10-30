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
miniconda_dir="$HOME/miniconda3"
mkdir -p "$miniconda_dir"
info_msg "Downloading latest miniconda executable..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    conda_script="curl https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh -o $miniconda_dir/miniconda.sh"
else
    conda_script="wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O $miniconda_dir/miniconda.sh"
fi
info_msg "Installing miniconda..."
$conda_script

bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
rm -rf ~/miniconda3/miniconda.sh
info_msg "Initializing bash and zsh with conda... "
~/miniconda3/bin/conda init bash
~/miniconda3/bin/conda init zsh

feedback $? "Installed miniconda successfully!" "Failed to install miniconda!"
