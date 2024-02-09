class InvalidCharacter(Exception):
    def __init__(self, message=""):
        self.message = "Invalid character: " + message
        super().__init__(self.message)


class MissingRightParanthesis(Exception):
    def __init__(self, message=""):
        self.message = "Missing right paranthesis: " + message
        super().__init__(self.message)


class MissingLeftParanthesis(Exception):
    def __init__(self, message=""):
        self.message = "Missing left paranthesis" + message
        super().__init__(self.message)


class InvalidExpression(Exception):
    def __init__(self, message=""):
        self.message = "The boolean expressoin is invalid: " + message
        super().__init__(self.message)


class TargetNumberMismatch(Exception):
    def __init__(self, message=""):
        self.message = "Mismatch in number of expected targets: " + message
        super().__init__(self.message)


class TestNotRan(Exception):
    def __init__(self, message=""):
        self.message = "The test hasn't been ran"
        super().__init__(self.message)


class MatchError(Exception):
    def __init__(self, message=""):
        self.message = "Something went wrong during matching: " + message
        super().__init__(self.message)


class InvalidIdentifier(Exception):
    def __init__(self, message=""):
        self.message = "Invalid identifier: " + message
        super().__init__(self.message)
