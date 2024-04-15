from typing import TypedDict
from flojoy import flojoy, String, OrderedPair
import json
import ast
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits.sql.base import create_sql_agent
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain.pydantic_v1 import BaseModel, Field

MAX_RETRIES_FOR_STRUCTURED_OUTPUT = 3  # Number of retries


class SnowflakeOutput(TypedDict):
    bar_plot_data: OrderedPair
    text_answer: String


@flojoy
def SNOWFLAKE(
    user_prompt: String,
    user: str,
    password: str,
    account: str,
    warehouse: str,
    database: str,
    schema: str,
    openai_api_key: str,
) -> SnowflakeOutput:
    """ASK QUESTIONS ABOUT A DATABASE FROM SNOWFLAKE.

    Inputs
    ------
    prompt : String
        the question that will be answered

    Parameters
    ----------
    user: str
        the user name used to log in to the snowflake account
    password: str
        the password used to log in to the snowflake account
    warehouse: str
        the warehouse associated with the snowflake account to search for the database
    database: str
        the database name to get the data from
    schema: str
        the database schema containing the relevant tables to get the data from
    openai_api_key: str
        the OPENAI API key associated with your OPENAI account used to access

    Returns
    -------
    OrderedPair
        the data to plot
    """

    snowflake_url = f"snowflake://{user}:{password}@{account}/{database}/{schema}?warehouse={warehouse}"

    db = SQLDatabase.from_uri(snowflake_url)

    # define the schema for the final output
    @tool
    class Response(BaseModel):
        """Finally, use this tool as response to return to the user."""

        user_requested_plot: bool = Field(
            "This field indicates whether the user requested something to be plotted in the initial field"
        )
        x_axis_query: str = Field(
            description="This is an SQL code snippet. This query will give the x-axis for the data to plot"
        )
        y_axis_query: str = Field(
            desciption="This is an SQL code snippet. This query will give the y-axis for the data to plot"
        )
        answer_to_prompt: str = Field(
            description="This field contains the answer to the user's initial prompt"
        )

    # use to validate Response, should match
    class ResponseValidation(BaseModel):
        user_requested_plot: bool
        x_axis_query: str
        y_axis_query: str
        answer_to_prompt: str

    tools = [Response]

    llm = ChatOpenAI(
        api_key=openai_api_key,
        model="gpt-4-turbo-preview",
        temperature=0,
    )

    prefix_template = f"""
    You are a world expert data analyst.
    DO NOT make any DML statements (INSERT, UPDATE, DELETE, DROP etc.) to the database.
    Always try to use the provided tools: {tools}
    """

    format_instructions = """
    Use the following format:

    Question: the input question you must answer
    Thought: you should always think about what to do
    Action: the action to take. Use a tool if you deem it necessary. The tools at your disposal are the following: [{tool_names}]
    Action Input: the input to the action
    Observation: the result of the action
    ... (this Thought/Action/Action Input/Observation can repeat N times)
    Thought: I now know the final answer
    Final Answer: The JSON string corresponding to the input of the args of the Response tool
    """

    agent_executor = create_sql_agent(
        llm,
        db=db,
        prefix_template=prefix_template,
        format_instructions=format_instructions,
        agent_type="zero-shot-react-description",
        verbose=True,
        extra_tools=tools,
    )

    attempts = 0

    while attempts < MAX_RETRIES_FOR_STRUCTURED_OUTPUT:
        try:
            answer = agent_executor.invoke({"input": user_prompt})

            def remove_json_triple_quote_from(string: str):
                if "```json" not in string:
                    return string
                return string.split("```json")[1].split("```")[0]

            answer_obj = json.loads(remove_json_triple_quote_from(answer["output"]))
            response = ResponseValidation.parse_obj(answer_obj)
            x = ast.literal_eval(db.run(response.x_axis_query))
            y = ast.literal_eval(db.run(response.y_axis_query))
            x_l = list(map(lambda x: x[0], x))
            y_l = list(map(lambda y: y[0], y))
            ordered_pair = OrderedPair(x=x_l, y=y_l)
            answer = String(s=response.answer_to_prompt)
            return SnowflakeOutput(bar_plot_data=ordered_pair, text_answer=answer)
        except Exception as e:  # Catch the specific exception you expect
            attempts += 1
            print(f"Attempt {attempts} failed with error: {e}")
            if attempts == MAX_RETRIES_FOR_STRUCTURED_OUTPUT:
                raise Exception(
                    "Agent failed to output properly multiple times, is the prompt correct?"
                )
