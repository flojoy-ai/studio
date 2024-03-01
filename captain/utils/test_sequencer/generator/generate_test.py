import uuid
from captain.models.test_sequencer import StatusTypes, Test, TestTypes
from captain.utils.logger import logger
import os
from openai import OpenAI
from captain.utils.test_sequencer.data_stream import _with_error_report

key = "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"  # TODO have this from .env, Joey said to hard code for now until his PR
client = OpenAI(api_key=key)


@_with_error_report
async def generate_test(test_type: TestTypes, prompt: str, test_container: dict):
    if test_type.value != "Python":  # for now only handle python tests
        return ""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You generate only raw python code for tests using assertions. If the user's request does not imply a test, simply output NULL",
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
        raise Exception("Unable to generate test")
    code = "\n".join(code_resp.splitlines()[1:-1])
    filename = "test_example.py"
    with open(filename, "w") as file:
        file.write(code)
    path_to_file = os.path.join(os.getcwd(), filename)
    test_container["test"] = Test.construct(
        type="test",
        id=uuid.uuid4(),
        group_id=uuid.uuid4(),
        path=path_to_file,
        test_name=filename,
        run_in_parallel=False,
        test_type=TestTypes.python,
        status=StatusTypes.pending,
        is_saved_to_cloud=False,
    )
