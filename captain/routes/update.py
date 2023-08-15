from fastapi import APIRouter
import subprocess

router = APIRouter(tags=["update"])


@router.get("/update/")
async def check_update():
    # Get the commit ID of the local branch
    branch_name = (
        subprocess.check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"])
        .strip()
        .decode()
    )

    local_commit_id = (
        subprocess.check_output(["git", "rev-parse", "HEAD"]).strip().decode()
    )

    # Get the commit ID of the remote branch
    remote_commit_id = (
        subprocess.check_output(
            ["git", "ls-remote", "origin", f"refs/heads/{branch_name}"]
        )
        .split()[0]
        .decode()
    )

    if local_commit_id != remote_commit_id:
        print("Update available")
        return True
    else:
        print("No update available")
        return False


@router.post("/update/")
async def get_update():
    subprocess.run(["git", "pull"])
