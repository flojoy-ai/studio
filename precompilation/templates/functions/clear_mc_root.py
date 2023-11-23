import os
def clear_directory(directory):
    for entry in os.ilistdir(directory):
        is_dir = entry[1] == 0x4000
        if is_dir:  
            clear_directory(directory + '/' + entry[0])
        else:  # If entry is a file, remove it
            os.remove(directory + '/' + entry[0])
    if directory != '/':  # guaranteed to be empty now, so delete it
        os.rmdir(directory)
clear_directory('/')