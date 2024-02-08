class InvalidCharacter(Exception):
    def __init__(self, message=""):
        self.message = "Invalid character: " + message


class MissingRightParanthesis(Exception):
    def __init__(self, message=""):
        self.message = "Missing right paranthesis: " + message


class MissingLeftParanthesis(Exception):
    def __init__(self, message=""):
        self.message = "Missing left paranthesis" + message


class InvalidExpression(Exception):
    def __init__(self, message=""):
        self.message = "The boolean expressoin is invalid: " + message


class TargetNumberMismatch(Exception):
    def __init__(self, message=""):
        self.message = "Mismatch in number of expected targets: " + message


class TestNotRan(Exception):
    def __init__(self, message=""):
        self.message = "The test hasn't been ran"


class MatchError(Exception):
    def __init__(self, message=""):
        self.message = "Something went wrong during matching: " + message


class InvalidIdentifier(Exception):
    def __init__(self, message=""):
        self.message = "Invalid identifier: " + message
