from flojoy import flojoy, Stateful, DataFrame
import pandas as pd
import logging


@flojoy(deps={"python-can": "4.3.1", "cantools": "39.4.2"})
def DECODE_CAN(
    dbc: Stateful,
    messages: Stateful,
) -> DataFrame:
    """DECODE_CAN a CAN message.

    DECODE_CAN a CAN message using the provided databse.

    Parameters
    ----------
    dbc : Stateful
        The database to use for decoding the message.
    messages : Stateful
        The message to DECODE_CAN. Must be a can.Message object.

    Returns
    -------
    DataFrame : DataFrame
        Return dataframe containing the DECODE_CANd message.
    """

    db = dbc.obj
    messages = messages.obj

    try:
        DECODE_CANd = [
            db.decode_message(message.arbitration_id, message.data)
            for message in messages
        ]
    except Exception as err:
        logging.error(f"Error decoding message: {err}")
        raise Exception(f"Error decoding message: {err}")

    return DataFrame(df=pd.DataFrame(DECODE_CANd))
