import uuid
from captain.models.test_sequencer import StatusTypes, Test, TestTypes
from captain.parser.bool_parser.utils.name_validator import validate_name
from captain.utils.logger import logger
import os
from openai import OpenAI
from captain.utils.test_sequencer.data_stream import _with_error_report

key = "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"  # TODO have this from .env, Joey said to hard code for now until his PR
client = OpenAI(api_key=key)


@_with_error_report
async def generate_test(
    test_name: str, test_type: TestTypes, prompt: str, test_container: dict
):
    if test_type.value != "Python":  # for now only handle python tests
        raise Exception("Only Python tests allowed")
    validate_name(test_name)  # this raises an error if invalid
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You generate only raw python code for tests using assertions. If the user's request does not imply a test, simply output 'NULL'",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
    )
    code_resp = response.choices[0].message.content
    if code_resp is None:
        raise Exception("Unable to generate code")
    if code_resp == "NULL":
        raise Exception("Invalid prompt/request, please specify something to test")
    code = "\n".join(code_resp.splitlines()[1:-1])
    path_to_gen_folder = os.path.join(os.getcwd(), "gen_tests")
    path_to_file = os.path.join(path_to_gen_folder, test_name)
    if not os.path.exists(path_to_gen_folder):
        os.makedirs(path_to_gen_folder)
    with open(path_to_file, "w") as file:
        file.write(code)
    test_container["test"] = Test.construct(
        type="test",
        id=uuid.uuid4(),
        group_id=uuid.uuid4(),
        path=path_to_file,
        test_name=test_name,
        run_in_parallel=False,
        test_type=TestTypes.python,
        status=StatusTypes.pending,
        is_saved_to_cloud=False,
    )
