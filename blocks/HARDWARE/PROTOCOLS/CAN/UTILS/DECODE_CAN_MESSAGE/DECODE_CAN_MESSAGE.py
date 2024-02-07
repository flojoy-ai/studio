from flojoy import flojoy, Stateful, DataFrame
import pandas as pd
import logging


@flojoy(deps={"python-can": "4.3.1", "cantools": "39.4.2"})
def DECODE_CAN_MESSAGE(
    dbc: Stateful,
    messages: Stateful,
    ignore_undefined_id_error: bool = False,
) -> DataFrame:
    """DECODE_CAN a CAN message.

    DECODE_CAN a CAN message using the provided databse.

    Parameters
    ----------
    dbc : Stateful
        The database to use for decoding the message.
    messages : Stateful
        The message to DECODE_CAN. Must be a can.Message object.
    ignore_undefined_id_error : bool
        If True, ignore undefined id error. Default is False.

    Returns
    -------
    DataFrame : DataFrame
        Return dataframe containing the DECODE_CANd message.
    """

    db = dbc.obj
    messages = messages.obj
    decoded_messages = []

    for message in messages:
        try:
            decoded_message = db.decode_message(message.arbitration_id, message.data)
            decoded_message["timestemp"] = message.timestamp
            decoded_messages.append(decoded_message)
        except Exception as err:
            logging.error(f"Error decoding message: {err}")
            if ignore_undefined_id_error:
                continue
            raise Exception(f"Error decoding message: {err}")

    return DataFrame(df=pd.DataFrame(decoded_messages))
