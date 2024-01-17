import pytest
import os
import shutil
import tempfile
from contextlib import contextmanager
from functools import wraps
from flojoy.utils import FLOJOY_CACHE_DIR
from unittest.mock import patch


@pytest.fixture
def mock_flojoy_decorator(deps=None):
    """A fixture that mocks the flojoy decorator to a no-op decorator that does not create a Flojoy node"""
    # TODO: Add support for mocking dependencies

    def no_op_decorator(func=None, **kwargs):
        def decorator(func):
            @wraps(func)
            def decorated_function(*args, **kwargs):
                return func(*args, **kwargs)

            return decorated_function

        if func is not None:
            return decorator(func)

        return decorator

    with patch("flojoy.flojoy") as mock_flojoy:
        mock_flojoy.side_effect = no_op_decorator
        yield mock_flojoy


@pytest.fixture
def mock_flojoy_venv_cache_directory():
    """A fixture that mocks the flojoy venv cache directory to a temporary directory"""
    with tempfile.TemporaryDirectory() as tempdir:
        with patch(
            "flojoy.flojoy_node_venv._get_venv_cache_dir", return_value=tempdir
        ) as mock_venv_cache_dir:
            yield mock_venv_cache_dir


@pytest.fixture
def cleanup_flojoy_cache_fixture():
    """A fixture that watches for additions to the flojoy cache directory and deletes them.
    NOTE: This fixture is not thread-safe. DO NOT run tests in parallel if using this.
    """

    # Helper functions for watching a directory for changes

    def get_all_paths(directory):
        """Recursively get all file and directory paths within the directory."""
        paths = set()
        for dirpath, dirnames, filenames in os.walk(directory):
            for filename in filenames:
                paths.add(os.path.join(dirpath, filename))
            for dirname in dirnames:
                paths.add(os.path.join(dirpath, dirname))
        return paths

    @contextmanager
    def watch_directory(path):
        """Watch a directory for changes and yield. After the yield, remove all new files or directories."""
        # Validate that path is a directory
        if os.path.exists(path) and not os.path.isdir(path):
            raise ValueError(f"{path} already exists and is a file")

        try:
            # Store initial files and directories
            initial_contents = get_all_paths(path)
            yield
        finally:
            # Store final files and directories
            final_contents = get_all_paths(path)

            # Find the difference between the two sets, this will be the new files or directories
            new_contents = final_contents - initial_contents

            # Remove all new files or directories
            for content in new_contents:
                if os.path.isfile(content):
                    os.remove(content)
                elif os.path.isdir(content) and not os.path.islink(content):
                    shutil.rmtree(content)
                else:
                    # Does not exist
                    pass

    with watch_directory(FLOJOY_CACHE_DIR):
        yield
