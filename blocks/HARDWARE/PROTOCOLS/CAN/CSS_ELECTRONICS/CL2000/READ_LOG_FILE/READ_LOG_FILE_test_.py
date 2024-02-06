from flojoy import File
import pytest
import os


def create_temp_file(file_content):
    file_path = "temp_test_file.txt"
    with open(file_path, 'w') as file:
        file.write(file_content)
    return file_path


@pytest.fixture
def temp_file_15_msgs():
    # Setup
    file_content = msgs_15
    file_path = create_temp_file(file_content)
    yield file_path
    # Teardown
    os.remove(file_path)


@pytest.fixture
def temp_file_msgs_annoying_date_format():
    # Setup
    file_content = msgs_with_annoying_date_format
    file_path = create_temp_file(file_content)
    yield file_path
    # Teardown
    os.remove(file_path)
    

def test_read_log_file_get_length(temp_file_15_msgs, mock_flojoy_decorator):
    import READ_LOG_FILE
    file = File(temp_file_15_msgs)

    messages = READ_LOG_FILE.READ_LOG_FILE(file).obj

    assert len(messages) == 15


def test_read_log_file_date_format(temp_file_msgs_annoying_date_format, mock_flojoy_decorator):
    import READ_LOG_FILE
    file = File(temp_file_msgs_annoying_date_format)
    first_ts = 0.210
    last_ts = 0.612

    messages = READ_LOG_FILE.READ_LOG_FILE(file).obj
    from pprint import pprint
    pprint(messages)

    ts_diff = messages[-1].timestamp - messages[0].timestamp
    assert ts_diff == last_ts - first_ts
    assert len(messages) == 25


# DATA
# ----
msgs_15 = """\
# Logger type: CANLogger3000
# HW rev: 7.xx
# FW rev: 5.40
# Logger ID: id0001
# Session No.: 92
# Split No.: 197
# Time: 20171209T140808
# Value separator: ";"
# Time format: 4
# Time separator: ""
# Time separator ms: ""
# Date separator: ""
# Time and date separator: "T"
# Bit-rate: 250000
# Silent mode: false
# Cyclic mode: true
Timestamp;Type;ID;Data
09T140808105;1;18feae30;ff648d8dffffcf3f
09T140808106;1;0c00000b;fcffff7dffffffff
09T140808107;1;18f0093e;577e7f8f7d077e79
09T140808107;1;18febf0b;00007d7d7d7dffff
09T140808108;1;0c001027;fcffff7dffffffff
09T140808108;1;0c000003;ecffffffffffffff
09T140808109;1;0cef27fd;20fffae1ff00ffff
09T140808110;1;0cf00203;cc000000405816ff
09T140808110;1;0cf00400;f37d94f016fff0ff
09T140808111;1;18f00503;7d00007d7d7d7ef0
09T140808111;1;1cfec703;fffffffffffc0300
09T140808114;1;0cfe6cee;0a00c0c000000000
09T140808116;1;0c00000b;fcffff7dffffffff
09T140808117;1;0cf00300;f1002affffff88ff
09T140808118;1;0c000003;ecffffffffffffff
"""

msgs_with_annoying_date_format = """\
# Logger type: CANLogger2000
# HW rev: 6.xx
# FW rev: 5.30
# Logger ID: VolvoXC70
# Session No.: 3
# Split No.: 1
# Time: 20000101T175956
# Value separator: ";"
# Time format: 6
# Time separator: "."
# Time separator ms: ","
# Date separator: "/"
# Time and date separator: " "
# Bit-rate: 500000
# Silent mode: false
# Cyclic mode: false
Timestamp;Lost;Type;ID;Length;Data
2000/01/01 17.59.55,210;0;8;7df;8;02010d5555555555
2000/01/01 17.59.55,216;0;0;7e8;8;03410d0000000000
2000/01/01 17.59.55,223;0;0;7e9;8;03410d0000000000
2000/01/01 17.59.55,262;0;0;7e8;8;04410c0a02000000
2000/01/01 17.59.55,260;0;8;7df;8;02010c5555555555
2000/01/01 17.59.55,262;0;0;7e9;8;04410c09fc000000
2000/01/01 17.59.55,311;0;0;7e8;8;03410d0000000000
2000/01/01 17.59.55,312;0;0;7e9;8;03410d0000000000
2000/01/01 17.59.55,310;0;8;7df;8;02010d5555555555
2000/01/01 17.59.55,360;0;8;7df;8;02010c5555555555
2000/01/01 17.59.55,362;0;0;7e9;8;04410c0a10000000
2000/01/01 17.59.55,363;0;0;7e8;8;04410c0a0b000000
2000/01/01 17.59.55,411;0;0;7e8;8;03410d0000000000
2000/01/01 17.59.55,412;0;0;7e9;8;03410d0000000000
2000/01/01 17.59.55,410;0;8;7df;8;02010d5555555555
2000/01/01 17.59.55,460;0;8;7df;8;02010c5555555555
2000/01/01 17.59.55,462;0;0;7e8;8;04410c0a06000000
2000/01/01 17.59.55,463;0;0;7e9;8;04410c0a04000000
2000/01/01 17.59.55,511;0;0;7e8;8;03410d0000000000
2000/01/01 17.59.55,512;0;0;7e9;8;03410d0000000000
2000/01/01 17.59.55,510;0;8;7df;8;02010d5555555555
2000/01/01 17.59.55,562;0;0;7e8;8;04410c09f5000000
2000/01/01 17.59.55,560;0;8;7df;8;02010c5555555555
2000/01/01 17.59.55,562;0;0;7e9;8;04410c09f4000000
2000/01/01 17.59.55,612;0;0;7e9;8;03410d0000000000
"""
