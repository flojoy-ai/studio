from flojoy import flojoy, Stateful, DataFrame
import can
import cantools
import logging
import pandas as pd


@flojoy(deps={"python-can": "4.2.2", "cantools": "39.4.2"})
def DECODE(
    dbc: Stateful,
    message: Stateful,
) -> DataFrame:
    """Decode a CAN message.

    Decode a CAN message using the provided databse.

    Parameters
    ----------
    dbc : Stateful
        The database to use for decoding the message.
    message : Stateful
        The message to decode. Must be a can.Message object.

    Returns
    -------
    DataFrame : DataFrame
        Return dataframe containing the decoded message.
    """

    db: cantools.database.Database = dbc.obj
    message: can.Message = message.obj

    decoded = db.decode_message(message.arbitration_id, message.data)

    logging.info(f"Decoded: {decoded} of type: {type(decoded)}")

    return DataFrame(df=pd.DataFrame([decoded]))
