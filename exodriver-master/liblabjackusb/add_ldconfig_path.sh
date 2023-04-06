#! /bin/bash
#
# add_ldconfig_path.sh
#
# Idempotently add a path to /etc/ld.so.conf

set -e
set -u

ldconfig_file=/etc/ld.so.conf
if [ $# -eq 0 ]; then
    path=/usr/local/lib
elif [ $# -eq 1 ]; then
    path=$1
else
    echo "$0 error - Invalid number of arguments"
    echo "Usage: $0 [LIB_DIRECTORY_PATH]"
    exit 1
fi

for line in `cat $ldconfig_file`; do
    if [ $line == $path ]; then
        # The path has already been added to the config file,
        # so there is nothing left to do.
        exit 0
    fi
done

echo "echo \"$path\" >> $ldconfig_file"
echo "$path" >> $ldconfig_file

