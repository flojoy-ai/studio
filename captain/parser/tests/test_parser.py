from functools import partial
from captain.parser.bool_parser.expressions.models import (
    Variable,
)
from captain.parser.bool_parser.bool_parser import eval_expression


symbol_table = {
    "fdg": Variable(False, 0.5),
    "dg": Variable(True, 5),
    "t": Variable(True, 3),
    "f": Variable(False, 12),
}
run_test = partial(eval_expression, symbol_table=symbol_table)


def _run(tests):
    for input, expected in tests:
        assert run_test(input) == expected


def test_literal_and_var():
    tests = [("True", True), ("False", False), ("$fdg", False), ("$dg", True)]
    _run(tests)


def test_or():
    tests = [
        ("$f | $f", False),
        ("$f | $f | $f", False),
        ("$f | $t | $f", True),
        ("$f | $f | $t", True),
        ("$t | $f", True),
    ]
    _run(tests)


def test_and():
    tests = [
        ("$f & $f", False),
        ("$t & $t", True),
        ("$t & $f", False),
        ("$f & $t", False),
        ("$f & $t | $f", False),
        ("$t & $t | $f", True),
        ("$t & ($t | $f)", True),
    ]
    _run(tests)


def test_not():
    tests = [
        ("!$t", False),
        ("!$f", True),
        ("!$t & $t", False),
        ("$f | !$t", False),
        ("!$f | $t", True),
        ("!!$t", True),
    ]
    _run(tests)


def test_subexpressions():
    tests = [
        ("($t | $t) & $f", False),
        ("$t & ($f | $t)", True),
        ("$t & !($t & $f)", True),
        ("!($t | $f)", False),
        ("($t & ($t | $f)) | !($f & $t)", True),
    ]
    _run(tests)
