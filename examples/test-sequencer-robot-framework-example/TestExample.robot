*** Settings ***
Library    flojoy_cloud.test_sequencer
Library     calculate.py

*** Test Cases ***
TEST EXPORT
    ${result}              Calculate       3 + 1
    # Export the `result` so it's display in the sequencer
    #  + this value will be upload to Flojoy Cloud
    Export                 ${result}
    Should Not Be Equal    4               ${result}

TEST ASSERT
    ${result}              Calculate       1 + 1
    Export                 ${result}
    # Call the `is_in_range` from the test_sequencer
    ${ok}                  Is In Range     ${result}
    Should Be True         ${ok}

