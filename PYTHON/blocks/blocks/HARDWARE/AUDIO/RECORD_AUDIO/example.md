In this example, we perform speech to text with the `RECORD AUDIO` and `SPEECH_2_TEXT` blocks.

This example requires a working microphone.

Note the the `RECORD AUDIO` requires a `path` and `file_name`. The path will be extracted from the file you choose, it does not have to match the file name chosen. The file will therefore be `{path}/{file_name}.wav`. The `SPEECH_2_TEXT` node however requires you choose the exact file. If the file is not created yet, you may have to run the `RECORD AUDIO` block first.