if ! git --git-dir="/PYTHON/FUNCTIONS" diff --quiet
then
    # do stuff...
    echo "different found!"
fi