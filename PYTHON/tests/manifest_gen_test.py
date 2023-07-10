from PYTHON.manifest.generate_node_manifest import create_manifest
import os
import pytest
import unittest

TEST_NODES_PATH = os.path.join("PYTHON", "tests", "manifest_test_nodes")


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
                },
                {
                    "name": "other",
                    "id": "other",
                    "type": "Any",
                    "multiple": False,
                },
            ],
            "parameters": {"some_param": {"type": "int", "default": None}},
            "outputs": [{"name": "default", "id": "default", "type": "OrderedPair"}],
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
                },
                {"name": "data", "id": "data", "type": "DataFrame", "multiple": False},
            ],
            "outputs": [{"name": "default", "id": "default", "type": "Image"}],
            "pip_dependencies": [{"name": "tensorflow", "v": "2.12.0"}],
        }

    def test_manifest_with_no_inputs(self):
        manifest = get_manifest("no_inputs.py")
        assert manifest == {
            "name": "NO_INPUTS",
            "key": "NO_INPUTS",
            "parameters": {
                "foo": {"type": "list[int]", "default": None},
                "bar": {"type": "str", "default": None},
            },
            "outputs": [{"name": "default", "id": "default", "type": "Any"}],
        }

    def test_manifest_with_node_type(self):
        manifest = get_manifest("node_type.py")

        assert manifest == {
            "name": "DEFAULT_NODE",
            "key": "DEFAULT_NODE",
            "type": "default",
            "inputs": [
                {"name": "default", "id": "default", "type": "Any", "multiple": False}
            ],
            "outputs": [{"name": "default", "id": "default", "type": "Any"}],
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
                },
            ],
            "parameters": {
                "foo": {"type": "str", "default": "bar"},
                "nums": {"type": "list[int]", "default": [1, 2, 3]},
            },
            "outputs": [{"name": "default", "id": "default", "type": "OrderedTriple"}],
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
                },
                {"name": "b", "id": "b", "type": "Any", "multiple": False},
                {
                    "name": "c",
                    "id": "c",
                    "type": "Matrix|DataFrame|Image",
                    "multiple": False,
                },
                {"name": "d", "id": "d", "type": "Any", "multiple": False},
            ],
            # "parameters": {
            #     "foo": {"type": "str|int", "default": "bar"},
            # },
            "outputs": [
                {
                    "name": "default",
                    "id": "default",
                    "type": "OrderedPair|OrderedTriple",
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
                },
                {"name": "b", "id": "b", "type": "Matrix", "multiple": False},
                {"name": "c", "id": "c", "type": "Any", "multiple": False},
            ],
            "parameters": {
                "foo": {"type": "str", "default": None},
                "bar": {"type": "list[int]", "default": None},
            },
            "outputs": [
                {
                    "name": "default",
                    "id": "default",
                    "type": "OrderedPair",
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
                {"name": "default", "id": "default", "type": "Any", "multiple": False}
            ],
            "parameters": {
                "option1": {
                    "type": "select",
                    "options": ["a", "b", "c"],
                    "default": "a",
                },
                "option2": {
                    "type": "select",
                    "options": ["d", "e", "f"],
                    "default": None,
                },
                "option3": {
                    "type": "select",
                    "options": [1, 2, 3],
                    "default": 3,
                },
            },
            "outputs": [
                {
                    "name": "default",
                    "id": "default",
                    "type": "Any",
                }
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
                },
                {"name": "b", "id": "b", "type": "OrderedPair", "multiple": True},
                {"name": "c", "id": "c", "type": "Matrix|DataFrame", "multiple": True},
            ],
            "parameters": {
                "foo": {"type": "list[int]", "default": None},
            },
            "outputs": [
                {
                    "name": "default",
                    "id": "default",
                    "type": "Matrix",
                }
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
                },
            ],
        }


if __name__ == "__main__":
    unittest.main()
