# error indicating that the function or class being imported already exists
class FunctionOrClassAlreadyExists(Exception):
    def __init__(
        self, message="The function or class you are trying to add already exists."
    ):
        self.message = message
        super().__init__(message)
