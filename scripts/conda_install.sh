miniconda_dir="$HOME/miniconda3"
mkdir -p "$miniconda_dir"

if [[ "$OSTYPE" == "darwin"* ]]; then
    conda_script="curl https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh -o $miniconda_dir/miniconda.sh"
else
    conda_script="wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O $miniconda_dir/miniconda.sh"
fi

$conda_script

bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
rm -rf ~/miniconda3/miniconda.sh

~/miniconda3/bin/conda init bash
~/miniconda3/bin/conda init zsh
