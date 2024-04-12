from flojoy import flojoy, String
import snowflake.connector
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import os


@flojoy(
    deps={
        "snowflake-connector-python": "3.8.1",
        "langchain": "0.1.16",
        "langchain-anthropic": "0.1.8",
    }
)
def SNOWFLAKE(
    user_prompt: String,
    user: str,
    password: str,
    account: str,
    warehouse: str,
    database: str,
    schema: str,
    anthropic_api_key: str,
) -> String:
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
    anthropic_api_key: str
        the Anthropic API key associated with your Anthropic account used to access Claude-3

    Returns
    -------
    String
        the answer to the prompt
    """
    # STEP 1: GET DATA FROM SNOWFLAKE
    # TODO: Have conn objects globally available sort of like hardware connections?
    conn = snowflake.connector.connect(
        user=user,
        password=password,
        account=account,
        warehouse=warehouse,
        database=database,
        schema=schema,
    )

    print("Getting data from Snowflake DB", flush=True)
    cursor = conn.cursor()
    try:
        # Fetch all tables in the specified schema
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
    finally:
        cursor.close()

    rows_str = []
    for table_data in tables:
        table_name = table_data[1]  # Depending on the format, might need adjustment

        cursor = conn.cursor()
        try:
            query = f"SELECT * FROM {table_name}"
            cursor.execute(query)

            # Fetch and print rows
            rows = cursor.fetchall()
            for row in rows:
                rows_str.append(str(row))

        except Exception as e:
            print(f"Error querying table {table_name}: {e}")
        finally:
            cursor.close()

    conn.close()
    data_str = "\n".join(rows_str)

    # STEP 2: Feed into LLM
    output_parser = StrOutputParser()
    llm = ChatAnthropic(
        api_key=anthropic_api_key, model="claude-3-opus-20240229", temperature=0
    )

    prompt = ChatPromptTemplate.from_template(
        """
        You are an expert data analyst.

        Use this data as context:
        <data>
        {data}
        </data>

        Now, answer the following question:
        <question>
        {input}
        </question>

        Begin!
    """
    )

    chain = prompt | llm | output_parser
    print("Invoking LLM...", flush=True)
    return String(s=chain.invoke({"data": data_str, "input": user_prompt.s}))
