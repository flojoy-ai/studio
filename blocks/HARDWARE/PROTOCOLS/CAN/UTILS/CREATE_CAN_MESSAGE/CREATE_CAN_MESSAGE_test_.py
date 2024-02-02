import pytest


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


def test_create_can_fd_msg(mock_flojoy_decorator):
    import CREATE_CAN_MESSAGE

    res = CREATE_CAN_MESSAGE.CREATE_CAN_MESSAGE(
        frame_id=0x123,
        data=[i for i in range(64)],
        error_frame=False,
        can_fd=True,
    )

    assert res.obj[0].arbitration_id == 0x123
    assert res.obj[0].is_fd

    with pytest.raises(ValueError):
        res = CREATE_CAN_MESSAGE.CREATE_CAN_MESSAGE(
            frame_id=0x123,
            data=[i for i in range(65)],
            error_frame=False,
            can_fd=True,
        )
