from PYTHON.manifest.generate_node_manifest import create_manifest
import os
import pytest
import unittest

TEST_NODES_PATH = os.path.join(os.getcwd(), "tests", "manifest_test_nodes")


def get_manifest(filename: str):
    return create_manifest(os.path.join(TEST_NODES_PATH, filename))


@pytest.mark.usefixtures("reload_flojoy")
class ManifestGenerationTest(unittest.TestCase):
    def test_basic_node_manifest(self):
        manifest = get_manifest("basic.py")
        assert manifest == {
            "name": "BASIC",
            "key": "BASIC",
            "type": "TEST_TYPE",
            "inputs": [
                {
                    "name": "default",
                    "id": "default",
                    "type": "OrderedPair",
                    "multiple": False,
                    "desc": None,
                },
                {
                    "name": "other",
                    "id": "other",
                    "type": "Any",
                    "multiple": False,
                    "desc": None,
                },
            ],
            "parameters": {
                "some_param": {"type": "int", "default": None, "desc": None}
            },
            "outputs": [
                {
                    "name": "default",
                    "id": "default",
                    "type": "OrderedPair",
                    "desc": None,
                }
            ],
        }

    def test_node_manifest_with_deps(self):
        manifest = get_manifest("extra_deps.py")

        assert manifest == {
            "name": "EXTRA_DEPS",
            "key": "EXTRA_DEPS",
            "type": "TEST_TYPE",
            "inputs": [
                {
                    "name": "mat",
                    "id": "mat",
                    "type": "Matrix",
                    "multiple": False,
                    "desc": None,
                },
                {
                    "name": "data",
                    "id": "data",
                    "type": "DataFrame",
                    "multiple": False,
                    "desc": None,
                },
            ],
            "outputs": [
                {"name": "default", "id": "default", "type": "Image", "desc": None}
            ],
            "pip_dependencies": [
                {"name": "tensorflow", "v": "2.12.0"},
                {"name": "torch", "v": "2.0.1"},
            ],
        }

    def test_manifest_with_no_inputs(self):
        manifest = get_manifest("no_inputs.py")
        assert manifest == {
            "name": "NO_INPUTS",
            "key": "NO_INPUTS",
            "parameters": {
                "foo": {"type": "list[int]", "default": None, "desc": None},
                "bar": {"type": "str", "default": None, "desc": None},
            },
            "outputs": [
                {"name": "default", "id": "default", "type": "Any", "desc": None}
            ],
        }

    def test_manifest_with_node_type(self):
        manifest = get_manifest("node_type.py")

        assert manifest == {
            "name": "DEFAULT_NODE",
            "key": "DEFAULT_NODE",
            "type": "default",
            "inputs": [
                {
                    "name": "default",
                    "id": "default",
                    "type": "Any",
                    "multiple": False,
                    "desc": None,
                }
            ],
            "outputs": [
                {"name": "default", "id": "default", "type": "Any", "desc": None}
            ],
        }

    def test_manifest_with_default_param_values(self):
        manifest = get_manifest("default_values.py")
        assert manifest == {
            "name": "DEFAULT_VALUES",
            "key": "DEFAULT_VALUES",
            "type": "TEST_TYPE",
            "inputs": [
                {
                    "name": "default",
                    "id": "default",
                    "type": "OrderedTriple",
                    "multiple": False,
                    "desc": None,
                },
            ],
            "parameters": {
                "foo": {"type": "str", "default": "bar", "desc": None},
                "nums": {"type": "list[int]", "default": [1, 2, 3], "desc": None},
            },
            "outputs": [
                {
                    "name": "default",
                    "id": "default",
                    "type": "OrderedTriple",
                    "desc": None,
                }
            ],
        }

    def test_manifest_with_unions(self):
        manifest = get_manifest("unions.py")
        assert manifest == {
            "name": "UNIONS",
            "key": "UNIONS",
            "type": "TEST_TYPE",
            "inputs": [
                {
                    "name": "a",
                    "id": "a",
                    "type": "Matrix|DataFrame|Image",
                    "multiple": False,
                    "desc": None,
                },
                {
                    "name": "b",
                    "id": "b",
                    "type": "Any",
                    "multiple": False,
                    "desc": None,
                },
                {
                    "name": "c",
                    "id": "c",
                    "type": "Matrix|DataFrame|Image",
                    "multiple": False,
                    "desc": None,
                },
                {
                    "name": "d",
                    "id": "d",
                    "type": "Any",
                    "multiple": False,
                    "desc": None,
                },
            ],
            # "parameters": {
            #     "foo": {"type": "str|int", "default": "bar"},
            # },
            "outputs": [
                {
                    "name": "default",
                    "id": "default",
                    "type": "OrderedPair|OrderedTriple",
                    "desc": None,
                }
            ],
        }

    def test_manifest_with_optionals(self):
        manifest = get_manifest("optionals.py")
        assert manifest == {
            "name": "OPTIONALS",
            "key": "OPTIONALS",
            "type": "TEST_TYPE",
            "inputs": [
                {
                    "name": "a",
                    "id": "a",
                    "type": "OrderedPair|OrderedTriple",
                    "multiple": False,
                    "desc": None,
                },
                {
                    "name": "b",
                    "id": "b",
                    "type": "Matrix",
                    "multiple": False,
                    "desc": None,
                },
                {
                    "name": "c",
                    "id": "c",
                    "type": "Any",
                    "multiple": False,
                    "desc": None,
                },
            ],
            "parameters": {
                "foo": {"type": "str", "default": None, "desc": None},
                "bar": {"type": "list[int]", "default": None, "desc": None},
            },
            "outputs": [
                {
                    "name": "default",
                    "id": "default",
                    "type": "OrderedPair",
                    "desc": None,
                }
            ],
        }

    def test_manifest_with_selects(self):
        manifest = get_manifest("selects.py")
        assert manifest == {
            "name": "SELECTS",
            "key": "SELECTS",
            "type": "TEST_TYPE",
            "inputs": [
                {
                    "name": "default",
                    "id": "default",
                    "type": "Any",
                    "multiple": False,
                    "desc": None,
                }
            ],
            "parameters": {
                "option1": {
                    "type": "select",
                    "options": ["a", "b", "c"],
                    "default": "a",
                    "desc": None,
                },
                "option2": {
                    "type": "select",
                    "options": ["d", "e", "f"],
                    "default": None,
                    "desc": None,
                },
                "option3": {
                    "type": "select",
                    "options": [1, 2, 3],
                    "default": 3,
                    "desc": None,
                },
            },
            "outputs": [
                {"name": "default", "id": "default", "type": "Any", "desc": None}
            ],
        }

    def test_manifest_with_multi_inputs(self):
        manifest = get_manifest("multiple_inputs.py")
        assert manifest == {
            "name": "MULTIPLE_INPUTS",
            "key": "MULTIPLE_INPUTS",
            "type": "TEST_TYPE",
            "inputs": [
                {
                    "name": "a",
                    "id": "a",
                    "type": "OrderedPair",
                    "multiple": False,
                    "desc": None,
                },
                {
                    "name": "b",
                    "id": "b",
                    "type": "OrderedPair",
                    "multiple": True,
                    "desc": None,
                },
                {
                    "name": "c",
                    "id": "c",
                    "type": "Matrix|DataFrame",
                    "multiple": True,
                    "desc": None,
                },
            ],
            "parameters": {
                "foo": {"type": "list[int]", "default": None, "desc": None},
            },
            "outputs": [
                {"name": "default", "id": "default", "type": "Matrix", "desc": None}
            ],
        }

    def test_end(self):
        manifest = get_manifest("end_test.py")
        assert manifest == {
            "name": "END",
            "key": "END",
            "inputs": [
                {
                    "name": "default",
                    "id": "default",
                    "type": "Any",
                    "multiple": False,
                    "desc": None,
                },
            ],
        }

    def test_docstring(self):
        manifest = get_manifest("docstring.py")
        assert manifest == {
            "name": "DOCSTRING",
            "key": "DOCSTRING",
            "type": "TEST_TYPE",
            "inputs": [
                {
                    "name": "a",
                    "id": "a",
                    "type": "OrderedPair",
                    "multiple": False,
                    "desc": "Does something cool\nover multiple lines",
                },
                {
                    "name": "b",
                    "id": "b",
                    "type": "OrderedPair",
                    "multiple": False,
                    "desc": "Does another cool thing",
                },
            ],
            "parameters": {
                "foo": {"type": "int", "default": None, "desc": "A number"},
                "bar": {"type": "str", "default": None, "desc": "A string"},
            },
            "outputs": [
                {
                    "name": "default",
                    "id": "default",
                    "type": "OrderedPair",
                    "desc": "The sum of cool things",
                }
            ],
        }

    def test_docstring_multi_return(self):
        manifest = get_manifest("docstring_multi_return.py")
        assert manifest == {
            "name": "DOCSTRING_MULTI_RETURN",
            "key": "DOCSTRING_MULTI_RETURN",
            "type": "TEST_TYPE",
            "inputs": [
                {
                    "name": "a",
                    "id": "a",
                    "type": "OrderedPair",
                    "multiple": False,
                    "desc": None,
                },
                {
                    "name": "b",
                    "id": "b",
                    "type": "OrderedPair",
                    "multiple": False,
                    "desc": None,
                },
            ],
            "outputs": [
                {
                    "name": "output1",
                    "id": "output1",
                    "type": "OrderedPair",
                    "desc": "Thing 1",
                },
                {
                    "name": "output2",
                    "id": "output2",
                    "type": "OrderedTriple",
                    "desc": "Thing 2",
                },
            ],
        }

    def test_node_init(self):
        manifest = get_manifest("node_init.py")
        assert manifest == {
            "name": "NODE_INIT",
            "key": "NODE_INIT",
            "type": "TEST_TYPE",
            "parameters": {
                "a": {"type": "int", "default": 0, "desc": None},
            },
            "init_parameters": {
                "foo": {"type": "str", "default": None, "desc": None},
                "bar": {"type": "int", "default": None, "desc": None},
                "baz": {"type": "float", "default": None, "desc": None},
                "quux": {"type": "bool", "default": None, "desc": None},
                "asdf": {"type": "Array", "default": None, "desc": None},
                "s": {"type": "str", "default": "hello", "desc": None},
            },
            "outputs": [
                {
                    "name": "default",
                    "id": "default",
                    "type": "OrderedPair",
                    "desc": None,
                },
            ],
        }


if __name__ == "__main__":
    unittest.main()
