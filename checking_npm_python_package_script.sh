echo "CHECKING NPM PACKAGES"
i=0
command=$(jq -r ".dependencies" package.json | jq "keys[$i]")
npm_list=$(npm list)
echo $npm_list

while [ "$command" != "null" ]
do
    package_name=$(echo "$command" | sed -e 's/^"//' -e 's/"$//')
    echo $package_name
    if [[ "$(npm list $package_name)" =~ "empty" ]]; then
        echo "Installing $package_name ..."
        npm install $package_name --legacy-peer-deps
    else
        echo "$package_name is already installed"
    fi
    i=$i+1
    command=$(jq -r ".dependencies" package.json | jq "keys[$i]")
done

echo "CHECKING PYTHON PACKAGES"

source venv/bin/activate

while read requirement
do
    arrIN=(${requirement//==/ })
    package=${arrIN[0]}
    echo "checking $package"
    if python3 -c "import $package" &> /dev/null; then
        echo 'all good'
    else
        pip install $package
    fi
done < requirements.txt
