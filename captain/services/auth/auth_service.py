import os
import json


def validate_credentials(username: str, password: str):
    db_path = os.environ.get("LOCAL_DB_PATH")
    print("db path: ", db_path)
    if not db_path:
        return False

    if not os.path.exists(db_path):
        return False

    with open(db_path, "r") as f:
        config = json.loads(f.read())
        users = config.get("users", [])
        print("users: ", users)

    for user in users:
        if (
            user.get("name") == username
            and user.get("password") == password
            and user.get("role") == "Admin"
        ):
            return True

    return False
