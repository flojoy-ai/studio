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
        status, _ = subprocess.getstatusoutput(["git", "--version"])
        if status != 0:
            raise NotImplementedError("Git is not found on you system")
        print("Git is installed")

        # Find the output folder
        profiles_dir = os.path.join(get_flojoy_dir(), f"test_profiles{os.sep}")

        # Create the dir if it doesn't exist
        if not os.path.exists(profiles_dir):
            os.makedirs(profiles_dir)
            print(f"Created {profiles_dir}")
        else:
            print(f"{profiles_dir} already exists")

        # Find the profile
        profile_root = os.path.join(profiles_dir, profile_name)
        if not os.path.exists(profile_root):
            # Clone the repo if it doesn't exist
            status, _ = subprocess.getstatusoutput(["git", "--depth", "1", "clone", url, profile_root])
            print(f"Cloning {url} - Status: {status}")
            if status != 0:
                raise Exception(f"Not able to clone {url} - Error: {status}")
        else:
            print(f"{profile_root} already exists")

        # Get the commit ID of the local branch
        branch_name = subprocess.check_output(["git", "-C", profile_root, "rev-parse", "--abbrev-ref", "HEAD"]).strip()
        local_commit_id = subprocess.check_output(["git", "-C", profile_root, "rev-parse", "HEAD"]).strip().decode()

        # Return the Base Folder & the hash
        print(f"Test Profile Loaded | dir:{profile_root} - branch: {branch_name} - hash: {local_commit_id}")
        profile_root = profile_root.replace(os.sep, "/")
        return Response(status_code=200, content=json.dumps({"profile_root": profile_root, "hash": local_commit_id}))
    except Exception as e:
        logging.error(f"Exception occured while installing {url}: {e}")
        logging.error(traceback.format_exc())
        Response(status_code=500, content=json.dumps({"error": f"{e}"}))


@router.post("/test_profile/update/")
async def get_update():
    subprocess.run(["git", "pull"])

