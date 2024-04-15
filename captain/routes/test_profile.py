import logging
import traceback
import subprocess
from typing import Annotated
from fastapi import APIRouter, Header, Response
import os
from flojoy_cloud.client import json
from captain.utils.blocks_path import get_flojoy_dir


router = APIRouter(tags=["test_profile"])


@router.get("/test_profile/install/")
async def install(url: Annotated[str, Header()]):
    """
    Download a git repo to the local machine if it's doesn't exist + verify its state
    - Currently done for Github. (infer that the repo doesn't contain space)
    - Private repo is not (directly) supported
    TODO:
    - [ ] Verify no change was done (git stash if so)
    - [ ] Only clone the head commit (no history)
    """
    try:
        profile_name = url.split("/")[-1].strip(".git")
        logging.info(f"Profile name: {profile_name}")

        # Check if Git is install
        cmd = ["git", "--version"]
        res = subprocess.run(cmd, capture_output=True)
        if res.returncode != 0:
            raise NotImplementedError("Git is not found on you system")

        # Find the output folder
        profiles_dir = os.path.join(get_flojoy_dir(), f"test_profiles{os.sep}")

        # Create the dir if it doesn't exist
        if not os.path.exists(profiles_dir):
            os.makedirs(profiles_dir)

        # Find the profile
        profile_root = os.path.join(profiles_dir, profile_name)
        if not os.path.exists(profile_root):
            # Clone the repo if it doesn't exist
            cmd = ["git", "clone", "--depth", "1", url, profile_root]
            res = subprocess.run(cmd, capture_output=True)
            if res.returncode != 0:
                stdout = res.stdout.decode("utf-8").strip()
                stderr = res.stderr.decode("utf-8").strip()
                logging.error(f"Error while cloning url: {stdout} - {stderr}")
                raise Exception(f"Not able to clone {url} - Error: {res.returncode}")
        else:
            # todo: check if the repo is up-to-date
            pass

        # Get the commit ID of the local branch
        cmd = ["git", "-C", profile_root, "rev-parse", "HEAD"]
        res = subprocess.run(cmd, capture_output=True)
        if res.returncode != 0:
            raise Exception(f"Not able to get the commit ID of the local branch - Error: {res.returncode}")
        local_commit_id = res.stdout.strip().decode()

        # Return the Base Folder & the hash
        profile_root = profile_root.replace(os.sep, "/")
        return Response(status_code=200, content=json.dumps({"profile_root": profile_root, "hash": local_commit_id}))
    except Exception as e:
        logging.error(f"Exception occured while installing {url}: {e}")
        logging.error(traceback.format_exc())
        Response(status_code=500, content=json.dumps({"error": f"{e}"}))


@router.post("/test_profile/update/")
async def get_update():
    subprocess.run(["git", "pull"])

