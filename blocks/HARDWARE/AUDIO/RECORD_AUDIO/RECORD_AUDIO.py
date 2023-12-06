from flojoy import flojoy, DataContainer, String, File
from typing import Optional, Literal
import pyaudio
import wave
from os import path


@flojoy(deps={"pyaudio": "0.2.13"})
def RECORD_AUDIO(
    file_name: str,
    file_path: File | None = None,
    record_length: float = 3,
    chunk_size: int = 1024,
    bits_per_sample: Literal[8, 16, 32] = 16,
    channels: int = 1,
    samples_per_second: int = 44100,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Records audio using a local microphone.

    Note that if the file is not yet created, you can choose a file in the
    same directory/folder.

    Parameters
    ----------
    file_name: str
        File name of the output audio file.
    file_path: File
        The path to save the audio file in. Select a file in the directory.
    record_length: float
        How long to record in seconds.
    chunk_size: int
        The size, in samples, to record.
    bits_per_sample: select
        The bits per sample.
    channels: int
        The number of channels for the recording (e.g. 2 = left and right).
    samples_per_second: int
        Samples per second. The bitrate is this multiplied by bits_per_sample.

    Returns
    -------
    String
        Filename and path of the recording.
    """
    file_path = file_path.unwrap() if file_path else None
    file_path = path.dirname(file_path)
    file_name = path.join(file_path, file_name)

    match bits_per_sample:
        case "8":
            sample_format = pyaudio.paInt8
        case "16":
            sample_format = pyaudio.paInt16
        case "32":
            sample_format = pyaudio.paInt32

    p = pyaudio.PyAudio()  # Create an interface to PortAudio

    print("Recording")

    stream = p.open(
        format=sample_format,
        channels=channels,
        rate=samples_per_second,
        frames_per_buffer=chunk_size,
        input=True,
    )

    frames = []  # Initialize array to store frames
    # Store data in chunks for 3 seconds
    for _ in range(0, int(samples_per_second / chunk_size * record_length)):
        data = stream.read(chunk_size)
        frames.append(data)

    # Stop and close the stream
    stream.stop_stream()
    stream.close()
    # Terminate the PortAudio interface
    p.terminate()

    print("Finished recording")

    # Save the recorded data as a WAV file
    wf = wave.open(f"{file_name}.wav", "wb")
    wf.setnchannels(channels)
    wf.setsampwidth(p.get_sample_size(sample_format))
    wf.setframerate(samples_per_second)
    wf.writeframes(b"".join(frames))
    wf.close()

    return String(s=file_name)
