class FileGroupContainer:

    def __init__(self, *args):
        self.file_to_dir = {}
        for arg in args:
            if not isinstance(arg, dict):
                raise Exception("All arguments must key value pairs where\
                                the key is the file and the value is the directory.")
            self.file_to_dir.update(arg)
    
    def __contains__(self, file):
        return file in self.file_to_dir.keys()
    
    def get_output_dir_of(self, file):
        return self.file_to_dir[file]

