class InvalidCharacter(Exception):
    def __init__(self, message=""):
        self.message = "Invalid character: " + message
        super().__init__(self.message)


class MissingRightParenthesis(Exception):
    def __init__(self, message=""):
        self.message = "Missing right parenthesis: " + message
        super().__init__(self.message)


class MissingLeftParenthesis(Exception):
    def __init__(self, message=""):
        self.message = "Missing left parenthesis" + message
        super().__init__(self.message)


class InvalidExpression(Exception):
    def __init__(self, message=""):
        self.message = "The boolean expression is invalid: " + message
        super().__init__(self.message)


class TargetNumberMismatch(Exception):
    def __init__(self, message=""):
        self.message = "Mismatch in number of expected targets: " + message
        super().__init__(self.message)


class TestNotRan(Exception):
    def __init__(self, message=""):
        self.message = "The test hasn't been ran:" + message
        super().__init__(self.message)


class MatchError(Exception):
    def __init__(self, message=""):
        self.message = "Something went wrong during matching: " + message
        super().__init__(self.message)


class InvalidIdentifier(Exception):
    def __init__(self, message=""):
        self.message = "Invalid identifier: " + message
        super().__init__(self.message)
