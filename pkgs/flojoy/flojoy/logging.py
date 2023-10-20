from contextlib import contextmanager
from functools import partial, wraps
import io
from typing import Callable, Literal, Protocol
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum, auto
import logging
import multiprocessing
import multiprocessing.connection
import threading
import os


class LogPipeMode(Enum):
    """
    An enumeration of the different modes for logging pipes.

    Attributes:
        MP_SPAWN: To be used when logging from a subprocess created using the `spawn` start method of the `multiprocessing` module.
        SUBPROCESS: To be used when logging from a subprocess created using the `subprocess` module.
    """

    MP_SPAWN = auto()
    SUBPROCESS = auto()


class StreamEnum(Enum):
    """
    An enumeration of the different streams to redirect.

    Attributes:
        STDOUT: To be used when redirecting stdout.
        STDERR: To be used when redirecting stderr.
    """

    STDOUT = auto()
    STDERR = auto()


class PipeWriter(Protocol):
    """Protocol for a pipe writer"""

    def write(self, data: bytes):
        ...

    def fileno(self) -> int:
        ...

    def close(self):
        ...

    def flush(self):
        ...


# Abstract Pipe class
class ReadWritePipe(ABC):
    """
    Abstract base class for a read-write pipe.

    This class defines the interface for a pipe that can be used for both reading and writing data.
    Subclasses must implement the abstract methods defined here to provide the necessary functionality
    to be used as a pipe for the LogPipe class.
    """

    @abstractmethod
    def read_is_empty(self) -> bool:
        """
        Check if the read buffer is empty.

        Returns:
            bool: True if the read buffer is empty, False otherwise.
        """
        pass

    @abstractmethod
    def close_read(self):
        """
        Close the read end of the pipe.
        """
        pass

    @abstractmethod
    def read_is_closed(self) -> bool:
        """
        Check if the read end of the pipe is closed.

        Returns:
            bool: True if the read end of the pipe is closed, False otherwise.
        """
        pass

    @abstractmethod
    def read(self) -> bytes:
        """
        Read data from the pipe.

        Returns:
            bytes: The data read from the pipe.
        """
        pass

    @abstractmethod
    def close_write(self):
        """
        Close the write end of the pipe.
        """
        pass

    @abstractmethod
    def write_is_closed(self) -> bool:
        """
        Check if the write end of the pipe is closed.

        Returns:
            bool: True if the write end of the pipe is closed, False otherwise.
        """
        pass

    @abstractmethod
    def get_writer(self) -> PipeWriter:
        """
        Get a PipeWriter object for writing to the pipe.

        Returns:
            PipeWriter: A PipeWriter object for writing to the pipe.
        """
        pass


class FileDescriptorReadWritePipe(ReadWritePipe):
    """
    A class that represents a pipe for reading and writing data using standard OS file descriptors.
    These pipes can be used to communicate between processes and are created using the os.pipe() function.

    The class is created to fulfill the need for logging from a python subprocess created with the `subprocess` module.

    Attributes:
        fd_read (int): The file descriptor for reading data.
        fd_write (int): The file descriptor for writing data.
        reader (file object): The file object for reading data.
        _writer_is_closed (bool): A flag indicating whether the writer has been closed.
    """

    def __init__(self):
        super().__init__()
        self.fd_read, self.fd_write = os.pipe()
        self.reader = os.fdopen(self.fd_read, mode="rb")
        self.writer = os.fdopen(self.fd_write, mode="wb")
        self._writer_is_closed = False

    def read_is_empty(self) -> bool:
        return not self.reader.peek()

    def read_is_closed(self) -> bool:
        return self.reader.closed

    def write_is_closed(self) -> bool:
        return self._writer_is_closed

    def close_write(self):
        os.close(self.fd_write)
        self._writer_is_closed = True

    def close_read(self):
        self.reader.close()

    def get_writer(self) -> PipeWriter:
        if self.write_is_closed():
            raise ValueError(
                "Attempted to get writer while the write end of the pipe is closed."
            )
        return self.writer

    def read(self) -> bytes:
        return self.reader.readline()


class MPSpawnReadWritePipe:
    """
    A multiprocessing pipe that allows for reading and writing data between processes.

    This class is a subclass of `ReadWritePipe` and uses the `multiprocessing` module to create a
    pipe that can be used to communicate between processes. It provides methods for reading and
    writing data to the pipe, as well as checking if the pipe is closed or empty. The class is created
    to fulfill the need for logging from a python subprocess created with the `multiprocessing` module using the `spawn` start method.

    Attributes:
        read_conn (multiprocessing.connection.Connection): The connection used for reading data
            from the pipe.
        write_conn (multiprocessing.connection.Connection): The connection used for writing data
            to the pipe.
        _writer_is_closed (bool): A flag indicating whether the writer connection has been closed.
    """

    @dataclass
    class _MPWriter:
        """
        A helper class used to write data to the pipe.

        This class is used internally by `MPSpawnReadWritePipe` to write data to the pipe. It
        implements the `write` and `fileno` methods required by `PipeWriter`.

        Attributes:
            write_conn (multiprocessing.connection.Connection): The connection used for writing
                data to the pipe.
        """

        write_conn: multiprocessing.connection.Connection

        def write(self, data: bytes):
            self.write_conn.send_bytes(data.encode("utf-8"))

        def fileno(self) -> int:
            return self.write_conn.fileno()

        def close(self):
            self.write_conn.close()

        def flush(self):
            pass

    def __init__(self) -> None:
        super().__init__()
        self.read_conn, self.write_conn = multiprocessing.get_context("spawn").Pipe(
            duplex=True
        )
        self._writer = MPSpawnReadWritePipe._MPWriter(write_conn=self.write_conn)
        self._writer_is_closed = False

    def read_is_empty(self) -> bool:
        return not self.read_conn.poll()

    def read_is_closed(self) -> bool:
        return self.read_conn.closed

    def close_read(self):
        return self.read_conn.close()

    def read(self) -> bytes:
        try:
            return self.read_conn.recv_bytes()
        except EOFError:
            return b""

    def write_is_closed(self) -> bool:
        return self._writer_is_closed

    def close_write(self):
        self.write_conn.close()
        self._writer_is_closed = True

    def get_writer(self) -> PipeWriter:
        if self.write_is_closed():
            raise ValueError(
                "Attempted to get writer while the write end of the pipe is closed."
            )
        return self._writer


@contextmanager
def _redirect_stream(stream: StreamEnum, pipe_writer: MPSpawnReadWritePipe._MPWriter):
    """Context manager to redirect stdout or stderr to a pipe writer."""
    # Import sys here to ensure we use the child process sys module

    import sys

    try:
        if stream == StreamEnum.STDOUT:
            sys.stdout = pipe_writer
        elif stream == StreamEnum.STDERR:
            sys.stderr = pipe_writer
        yield
    finally:
        if stream == StreamEnum.STDOUT:
            sys.stdout = sys.__stdout__
        elif stream == StreamEnum.STDERR:
            sys.stderr = sys.__stderr__


def _wrap_to_redirect_stream(func, stream, pipe_writer, *args, **kwargs):
    """Wrap a function to redirect its stdout or stderr to a pipe writer.
    This should be used with functools.partial to keep things pickleable, rather
    than defining the wrapper locally within wrap_and_redirect_stream."""
    with _redirect_stream(stream, pipe_writer):
        return func(*args, **kwargs)


class LogPipe:
    """
    A class to log data from python subprocesses.

    This class is a context manager that can be used to redirect logs from a python subprocess to the
    provided logger. It uses internally a pipe to read data from the either one of the subprocesses's
    standard streams (stdout, stderr) and log it to the provided logger at the provided level.
    The class is created to fulfill the need for logging from a python subprocess.


    Args:
        logger (logging.Logger): The logger to use for logging.
        log_level (int): The log level to use for logging.
        mode (LogPipeMode): The mode to use for the pipe.
        buffer_logs (bool): Whether to buffer the logs in memory. Defaults to False.
            If set the true, the logs will be available in the `log_buffer` attribute after the context manager exits.
            Otherwise, the `log_buffer` attribute will be None.

    Raises:
        ValueError: If an invalid mode is provided.

    Example for the `subprocessing` module:
        ```
        logger = logging.getLogger("foo")
        with LogPipe(logger=logger, log_level=logging.INFO, mode=LogPipeMode.MP_SPAWN, buffer_logs=True) as lp:
            # Run a subprocess and log its output. The stdout of the subprocess will be logged to the logger
            # at the provided level automatically.
            subprocess.run(["echo", "Hello, world!"], stdout=lp.get_pipe_writer())
        # Get the logs from the buffer. The logs will be available in the buffer only if `buffer_logs` was set to True.
        # This is a convenience method only, and could have been done manually by adding a handler to the logger.
        captured_stdout = lp.log_buffer.getvalue()
        ```

    Example for the `multiprocessing` module with the `spawn` start method:
    ```

        def foo(x: int, y: int) -> int:
            print("HELLO FROM FOO")
            return x + y

        logger = logging.getLogger("foo")
        with LogPipe(logger=logger, log_level=logging.INFO, mode=LogPipeMode.MP_SPAWN, buffer_logs=True) as lp:
            # Create a process and log its output. The stdout of the process will be logged to the logger
            # at the provided level automatically.
            foo_wrapped = LogPipe.wrap_and_redirect_stream(foo, StreamEnum.STDOUT, lp.get_pipe_writer())
            p = multiprocessing.get_context("spawn").Process(target=foo_wrapped, args=(lp,))
            p.start()
            p.join()
        # Get the logs from the buffer. The logs will be available in the buffer only if `buffer_logs` was set to True.
        # This is a convenience method only, and could have been done manually by adding a handler to the logger.
        captured_stdout = lp.log_buffer.getvalue()
    """

    def __init__(
        self,
        logger: logging.Logger,
        log_level: int,
        mode: LogPipeMode,
        buffer_logs: bool = False,
    ):
        if mode == LogPipeMode.MP_SPAWN:
            self.pipe = MPSpawnReadWritePipe()
        elif mode == LogPipeMode.SUBPROCESS:
            self.pipe = FileDescriptorReadWritePipe()
        else:
            raise ValueError(
                f"Invalid mode {mode}, expected one of {LogPipeMode.__members__}"
            )
        self.mode = mode
        self.thread = threading.Thread(target=self.run, daemon=False)
        self.logger = logger
        self.log_level = log_level
        self.pipe_read_lock = threading.Lock()
        self.log_buffer = None
        if buffer_logs:
            self.log_buffer = io.StringIO()
            logger.addHandler(logging.StreamHandler(self.log_buffer))

    def log_from_pipe(self, data: bytes):
        data_str = data.decode("utf-8").strip("\n")
        if data_str != "":
            self.logger.log(self.log_level, data_str)

    def run(self):
        """Log everything that comes from the pipe."""
        while True:
            # Check if the write end is closed
            if self.pipe.write_is_closed():
                # Read until empty, then release then lock
                while data := self.pipe.read():
                    self.log_from_pipe(data)
                return
            # Check if not empty and read
            if not self.pipe.read_is_empty():
                # Acquire the lock to ensure the write end isn't closed at this time
                with self.pipe_read_lock:
                    data = self.pipe.read()
                self.log_from_pipe(data)

    def __enter__(self):
        self.thread.start()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        # Close the write end of the pipe
        with self.pipe_read_lock:
            self.pipe.close_write()
        # Wait for the thread to finish and flush any remaining logs
        # TODO(roulbac): Daemon thread, do we really need to join?
        self.thread.join()
        # Close the read end
        self.pipe.close_read()

    def get_pipe_writer(self) -> PipeWriter:
        return self.pipe.get_writer()

    @staticmethod
    def wrap_and_redirect_stream(
        func: Callable, stream: StreamEnum, pipe_writer: PipeWriter
    ) -> Callable:
        """
        Wraps a function to redirect its output to a pipe writer.

        Args:
            func (Callable): The function to wrap.
            stream (Literal["stdout", "stderr"]): The stream to redirect. Must be one of "stdout" or "stderr".
            pipe_writer (PipeWriter): The pipe writer to redirect the stream to.

        Returns:
            Callable: The wrapped function.
        """

        if stream not in StreamEnum.__members__.values():
            raise ValueError(
                f"Invalid stream {stream}, expected one of {StreamEnum.__members__}"
            )

        if not isinstance(pipe_writer, MPSpawnReadWritePipe._MPWriter):
            raise ValueError(
                "Invalid pipe_writer, please provide a writer for a LogPipe started in MP_SPAWN mode"
            )

        return partial(
            _wrap_to_redirect_stream, func=func, stream=stream, pipe_writer=pipe_writer
        )
