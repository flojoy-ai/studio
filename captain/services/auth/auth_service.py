import os
import json
import bcrypt


def compare_pass(hashed_password: str, plain_password: str):
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )


def validate_credentials(username: str, password: str):
    db_path = os.environ.get("LOCAL_DB_PATH", None)

    if not db_path:
        return False

    if not os.path.exists(db_path):
        return False

    with open(db_path, "r") as f:
        config = json.loads(f.read())
        users = config.get("users", [])

    for user in users:
        if (
            user.get("name") == username
            and compare_pass(user.get("password"), password)
            and user.get("role") == "Admin"
        ):
            return True

    return False
