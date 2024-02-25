import os
import json
import bcrypt
import base64


def compare_pass(hashed_password: str, plain_password: str):
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )


def validate_credentials(username: str, password: str):
    user = get_user(username)

    if (not user) or user.get("role") != "Admin":
        return False

    if user.get("password") and (not compare_pass(user.get("password", ""), password)):
        return False

    return True


def get_user(username: str):
    db_path = os.environ.get("LOCAL_DB_PATH", None)

    if not db_path:
        return None

    if not os.path.exists(db_path):
        return None

    with open(db_path, "r") as f:
        config = json.load(f)
        users: list[dict[str, str]] = config.get("users", [])
        for user in users:
            if user.get("name") == username:
                return user

    return None


def get_base64_credentials(username: str, password: str):
    return base64.b64encode(f"{username}:{password}".encode("utf-8")).decode("utf-8")
