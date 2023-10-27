import io
import sys
import json
from textwrap import dedent
from typing import Any
import pytest
import os
import shutil
from unittest.mock import patch
import threading
import tempfile
from time import sleep
import logging
import http.server
import socketserver
import subprocess
from queue import Queue

import requests


pytestmark = pytest.mark.slow


# Define a fixture that creates a local server to receive requests in the background
@pytest.fixture(scope="function")
def local_server():
    post_data = []  # List to store POST request contents

    # Define a handler for the server
    class Handler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, format: str, *args: Any) -> None:
            pass

        def do_POST(self):
            content_length = int(self.headers["Content-Length"])
            post_body = self.rfile.read(content_length)
            post_data.append(
                post_body.decode("utf-8")
            )  # Add the POST content to the post_data list
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"POST received")

    # Start the server in a thread
    server = socketserver.TCPServer(("localhost", 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    # Yield the server and post_data so you can inspect it after the test if required
    yield server, post_data

    # Clean up
    server.shutdown()
    thread.join()


@pytest.fixture(scope="module")
def configure_logging():
    logging.basicConfig(
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        level=logging.INFO,
        force=True,
    )


# Define a fixture to patch tempfile.tempdir
@pytest.fixture
def mock_venv_cache_dir():
    _test_tempdir = os.path.realpath(
        os.path.join(tempfile.gettempdir(), "test_flojoy_node_venv")
    )
    # Wipe the directory to be patched if it exists
    shutil.rmtree(_test_tempdir, ignore_errors=True)
    os.makedirs(_test_tempdir)
    # Patch the tempfile.tempdir
    with patch(
        "flojoy.flojoy_node_venv._get_venv_cache_dir", return_value=_test_tempdir
    ):
        yield _test_tempdir
    # Clean up
    shutil.rmtree(_test_tempdir)


@pytest.fixture
def run_in_venv_script_source_code():
    return dedent(
        """
    from flojoy import run_in_venv

    @run_in_venv(pip_dependencies=["numpy", "torch"], verbose=True)
    def inner_func():
        import torch
        import numpy as np
        return 0

    inner_func()
    """
    )


def test_run_in_venv_streams_logs_to_http_server(
    mock_venv_cache_dir, configure_logging, local_server
):
    from flojoy import run_in_venv

    # Get the URL of the local server
    server, post_data = local_server

    url = f"http://{server.server_address[0]}:{server.server_address[1]}"

    class HttpLogHandler(logging.Handler):
        def __init__(self, url):
            super().__init__()
            self.url = url

        def emit(self, record):
            log_entry = self.format(record)
            headers = {"Content-type": "application/json"}
            requests.post(self.url, data=json.dumps(log_entry), headers=headers)

    logger = logging.getLogger("func_that_streams_logs_to_server")
    handler = HttpLogHandler(url)
    handler.setFormatter(
        logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    )
    logger.addHandler(handler)

    @run_in_venv(pip_dependencies=["numpy"], verbose=True)
    def func_that_streams_logs_to_server():
        import sys

        print("Hi from the other virtual environment")
        print("Oops, I did it again", file=sys.stderr)

    # Execute that function
    func_that_streams_logs_to_server()

    # Check post_data contains the expected logs
    post_data_str = "\n".join(post_data)
    assert "numpy" in post_data_str
    assert "flojoy" in post_data_str
    assert "cloudpickle" in post_data_str
    assert "Hi from the other virtual environment" in post_data_str
    assert "Oops, I did it again" in post_data_str


def test_run_in_venv_streams_logs_to_console(mock_venv_cache_dir, configure_logging):
    from flojoy import run_in_venv

    # Get the logger for the function below
    logger = logging.getLogger("func_that_streams_logs_to_console")
    # Create a buffer to capture logs
    buf = io.StringIO()
    # Add a handler to the logger such that buffer is written to when the logger is used
    logger.addHandler(logging.StreamHandler(buf))
    # Start a thread that logs the size of the buffer every 0.1s,
    buf_sizes = []

    def monitor_buffer():
        while not buf.closed:
            buf_sizes.append(buf.tell())
            sleep(0.1)

    thread = threading.Thread(target=monitor_buffer, daemon=False)
    thread.start()

    @run_in_venv(pip_dependencies=["numpy"], verbose=True)
    def func_that_streams_logs_to_console():
        import sys
        from time import sleep

        for i in range(100):
            print(f"HELLO FROM FOO {i}")
            print(f"HELLO STDERR FROM FOO {i}", file=sys.stderr)
            sleep(0.01)
        return 42

    # Run foo
    func_that_streams_logs_to_console()
    # Close the buffer then join the thread
    buf_val = buf.getvalue()
    buf.close()
    thread.join()
    # Check that the buffer size has increased over time
    diff = [buf_sizes[i + 1] - buf_sizes[i] for i in range(len(buf_sizes) - 1)]
    assert all([d >= 0 for d in diff])
    # Check that the buffer contains the expected output
    # 1 - For pip install numpy
    assert "numpy" in buf_val
    assert "flojoy" in buf_val
    assert "cloudpickle" in buf_val
    # 2 - For the print statements from within the function
    for i in range(100):
        assert f"HELLO FROM FOO {i}" in buf_val
        assert f"HELLO STDERR FROM FOO {i}" in buf_val


def test_run_in_venv_imports_jax_properly(mock_venv_cache_dir, configure_logging):
    """Test that run_in_venv imports properly jax for example"""

    from flojoy import run_in_venv

    @run_in_venv(pip_dependencies=["jax[cpu]==0.4.13"])
    def empty_function_with_jax():
        # Import jax to check if it is installed
        # Fetch the list of installed packages
        import sys
        import importlib.metadata

        # Get the list of installed packages
        packages_dict = {
            package.name: package.version
            for package in importlib.metadata.distributions()
        }
        return packages_dict, sys.path, sys.executable

    # Run the function
    packages_dict, sys_path, sys_executable = empty_function_with_jax()
    # Test for executable
    assert sys_executable.startswith(mock_venv_cache_dir)
    # Test for sys.path
    assert sys_path[-1].startswith(os.path.dirname(__file__))
    assert sys_path[-2].startswith(mock_venv_cache_dir)
    # Test for package version
    assert packages_dict["jax"] == "0.4.13"


# Skip until dependency versions can be resolved with Flojoy (incompatible pandas versions)
@pytest.mark.skip(reason="Skip until dependencies on pandas can be resolved")
def test_run_in_venv_imports_flytekit_properly(mock_venv_cache_dir, configure_logging):
    from flojoy import run_in_venv

    # Define a function that imports flytekit and returns its version
    @run_in_venv(pip_dependencies=["flytekit==1.9.0"])
    def empty_function_with_flytekit():
        import sys
        import importlib.metadata

        # Get the list of installed packages
        packages_dict = {
            package.name: package.version
            for package in importlib.metadata.distributions()
        }
        return packages_dict, sys.path, sys.executable

    # Run the function
    packages_dict, sys_path, sys_executable = empty_function_with_flytekit()
    # Test for executable
    assert sys_executable.startswith(mock_venv_cache_dir)
    # Test for sys.path
    assert sys_path[-1].startswith(os.path.dirname(__file__))
    assert sys_path[-2].startswith(mock_venv_cache_dir)
    # Test for package version
    assert packages_dict["flytekit"] == "1.9.0"


def test_run_in_venv_imports_opencv_properly(mock_venv_cache_dir, configure_logging):
    # Define a function that imports opencv-python-headless and returns its version

    from flojoy import run_in_venv

    @run_in_venv(pip_dependencies=["opencv-python-headless==4.7.0.72"])
    def empty_function_with_opencv():
        import sys
        import importlib.metadata

        # Get the list of installed packages
        packages_dict = {
            package.name: package.version
            for package in importlib.metadata.distributions()
        }
        return packages_dict, sys.path, sys.executable

    # Run the function
    packages_dict, sys_path, sys_executable = empty_function_with_opencv()
    # Test for executable
    assert sys_executable.startswith(mock_venv_cache_dir)
    # Test for sys.path
    assert sys_path[-1].startswith(os.path.dirname(__file__))
    assert sys_path[-2].startswith(mock_venv_cache_dir)
    # Test for package version
    assert packages_dict["opencv-python-headless"] == "4.7.0.72"


def test_run_in_venv_does_not_hang_on_error(mock_venv_cache_dir, configure_logging):
    """Test that run_in_venv imports properly jax for example"""

    from flojoy import run_in_venv

    @run_in_venv(pip_dependencies=[])
    def empty_function_with_error():
        return 1 / 0

    # Run the function and expect an error
    with pytest.raises(ChildProcessError):
        empty_function_with_error()


@pytest.mark.parametrize("daemon", [True, False])
def test_run_in_venv_runs_within_thread(mock_venv_cache_dir, configure_logging, daemon):
    def function_to_run_within_thread(queue):
        from flojoy import run_in_venv

        @run_in_venv(pip_dependencies=["numpy"])
        def func_with_venv():
            return 42

        # Run the function
        queue.put(func_with_venv())

    # Run the function in a thread
    queue = Queue()
    thread = threading.Thread(
        target=function_to_run_within_thread, args=(queue,), daemon=daemon
    )
    thread.start()
    thread.join()
    # Check that the thread has finished
    assert not thread.is_alive()
    # Check that there is something in the queue
    assert not queue.empty()
    # Check that the function has returned
    assert queue.get(timeout=60) == 42


def test_run_in_venv_same_pip_deps_from_two_subprocesses_is_safe(
    mock_venv_cache_dir, configure_logging, run_in_venv_script_source_code
):
    """Tests that two functions ran from two subprocesses do not interfere with each other"""
    # Spawn the two functions in two subprocesses
    # Repeat 10 times
    for _ in range(10):
        p1 = subprocess.Popen(
            [sys.executable, "-c", f"{run_in_venv_script_source_code}"]
        )
        p2 = subprocess.Popen(
            [sys.executable, "-c", f"{run_in_venv_script_source_code}"]
        )
        # Wait for the two processes to finish
        p1.wait()
        p2.wait()
        # Check that the processes have finished successfully
        assert p1.returncode == 0 and p2.returncode == 0
