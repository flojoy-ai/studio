import shutil

class FileUploader():
    def set_target(self, file):
        self.f_target = file
        return self

    def set_destination(self, destination):
        self.destination = destination
        return self

    def upload(self):
        # copy f_target to destination
        shutil.copy(self.f_target, self.destination)
        return self