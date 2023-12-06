from flojoy import flojoy, DataContainer, TextBlob, File
from typing import Optional
from huggingsound import SpeechRecognitionModel


@flojoy(deps={"huggingsound": "0.1.6"})
def SPEECH_2_TEXT(
    file_path: File | None = None,
    default: Optional[DataContainer] = None,
) -> Optional[DataContainer]:
    """Performs speech to text on the selected audio file.

    Parameters
    ----------
    file_path: File
        File name of the audio file.

    Returns
    -------
    TextBlob
        Filename and path of the recording.
    """
    file_path = file_path.unwrap() if file_path else None
    model = SpeechRecognitionModel("jonatasgrosman/wav2vec2-large-xlsr-53-english")

    audio_paths = [file_path]
    transcriptions = model.transcribe(audio_paths)

    return TextBlob(text_blob=transcriptions[0]["transcription"])
