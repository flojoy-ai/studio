from captain.models.test_sequencer import Message


def handle_data(json_str):
    """
    Handles the data received from the test sequencer websocket

    Parameters:
    data (string): the text received from the websocket
    """
    data = Message.parse_raw(json_str)
    print(data, "bruh", flush=True)

    pass
