from flojoy import flojoy, Stateful, DataFrame
import pandas as pd


@flojoy(deps={"python-can": "4.2.2", "cantools": "39.4.2"})
def DECODE(
    dbc: Stateful,
    messages: Stateful,
) -> DataFrame:
    """Decode a CAN message.

    Decode a CAN message using the provided databse.

    Parameters
    ----------
    dbc : Stateful
        The database to use for decoding the message.
    messages : Stateful
        The message to decode. Must be a can.Message object.

    Returns
    -------
    DataFrame : DataFrame
        Return dataframe containing the decoded message.
    """

    db = dbc.obj
    messages = messages.obj

    decoded = [
        db.decode_message(message.arbitration_id, message.data) for message in messages
    ]

    return DataFrame(df=pd.DataFrame(decoded))
