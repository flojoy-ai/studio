from channels.layers import get_channel_layer


async def send_msg_to_socket(msg: dict):
    layer = get_channel_layer()
    await layer.group_send("flojoy", {"type": "worker_response", **msg})
