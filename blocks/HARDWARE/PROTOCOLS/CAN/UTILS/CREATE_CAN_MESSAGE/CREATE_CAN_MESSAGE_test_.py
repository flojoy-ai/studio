

def test_create_can_msg(mock_flojoy_decorator):
    import CREATE_CAN_MESSAGE

    res = CREATE_CAN_MESSAGE.CREATE_CAN_MESSAGE(
        frame_id=0x123,
        data=[1, 2, 3, 4, 5, 6, 7, 8],
        error_frame=False,
        can_fd=False,
    )

    assert res.obj[0].arbitration_id == 0x123
    assert res.obj[0].dlc == 8
