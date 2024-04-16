import logging
import traceback
import subprocess
from typing import Annotated
from fastapi import APIRouter, Header, Response
import os
import json
from captain.utils.blocks_path import get_flojoy_dir


router = APIRouter(tags=["test_profile"])


@router.get("/test_profile/install/")
async def install(url: Annotated[str, Header()]):
    """
    Download a git repo to the local machine if it's doesn't exist + verify its state
    - Currently done for Github. (infer that the repo doesn't contain space)
    - Private repo is not (directly) supported
    TODO:
    - [ ] Backup if git is not install on the system
    """
    try:
        logging.info(f"Installing the profile from the url: {url}")
        verify_git_install()
        profiles_path = get_profiles_dir()
        profile_path = get_profile_path_from_url(profiles_path, url)

        # Find the profile
        if not os.path.exists(profile_path):
            # Clone the repo if it doesn't exist
            cmd = ["git", "clone", "--depth", "1", url, profile_path]
            res = subprocess.run(cmd, capture_output=True)
            if res.returncode != 0:
                stdout = res.stdout.decode("utf-8").strip()
                stderr = res.stderr.decode("utf-8").strip()
                logging.error(f"Error while cloning url: {stdout} - {stderr}")
                raise Exception(f"Not able to clone {url} - Error: {res.returncode}")
        else:
            update_to_origin_main(profile_path)

        commit_hash = get_commit_hash(profile_path)
        profile_path = profile_path.replace(os.sep, "/")
        return Response(
            status_code=200,
            content=json.dumps({"profile_root": profile_path, "hash": commit_hash}),
        )
    except Exception as e:
        logging.error(f"Exception occured while installing {url}: {e}")
        logging.error(traceback.format_exc())
        Response(status_code=500, content=json.dumps({"error": f"{e}"}))


@router.post("/test_profile/checkout/{commit_hash}/")
async def checkout(url: Annotated[str, Header()], commit_hash: str):
    try:
        logging.info(f"Switching to the commit: {commit_hash} for the profile: {url}")
        verify_git_install()
        profiles_path = get_profiles_dir()
        profile_path = get_profile_path_from_url(profiles_path, url)
        curr_commit_hash = get_commit_hash(profile_path)
        if curr_commit_hash != commit_hash:
            cmd = ["git", "-C", profile_path, "fetch", "--all"]
            res = subprocess.run(cmd, capture_output=True)
            if res.returncode != 0:
                raise Exception(f"Not able to fetch the repo - Error: {res.returncode}")
            cmd = ["git", "-C", profile_path, "checkout", commit_hash]
            res = subprocess.run(cmd, capture_output=True)
            if res.returncode != 0:
                raise Exception(
                    f"Not able to checkout the commit - Error: {res.returncode}"
                )

        commit_hash = get_commit_hash(profile_path)
        return Response(
            status_code=200,
            content=json.dumps({"profile_root": profile_path, "hash": commit_hash}),
        )
    except Exception as e:
        logging.error(f"Exception occured while installing {url}: {e}")
        logging.error(traceback.format_exc())
        Response(status_code=500, content=json.dumps({"error": f"{e}"}))


# Helper functions ------------------------------------------------------------


def get_profile_path_from_url(profiles_path: str, url: str):
    profile_name = url.split("/")[-1].strip(".git")
    logging.info(f"Profile name: {profile_name}")
    profile_root = os.path.join(profiles_path, profile_name)
    return profile_root


def verify_git_install():
    cmd = ["git", "--version"]
    res = subprocess.run(cmd, capture_output=True)
    if res.returncode != 0:
        raise NotImplementedError("Git is not found on you system")


def get_profiles_dir():
    profiles_dir = os.path.join(get_flojoy_dir(), f"test_profiles{os.sep}")
    if not os.path.exists(profiles_dir):
        os.makedirs(profiles_dir)
    return profiles_dir


def get_commit_hash(profile_path: str):
    cmd = ["git", "-C", profile_path, "rev-parse", "HEAD"]
    res = subprocess.run(cmd, capture_output=True)
    if res.returncode != 0:
        raise Exception(
            f"Not able to get the commit ID of the local branch - Error: {res.returncode}"
        )
    return res.stdout.strip().decode()


def update_to_origin_main(profile_path: str):
    logging.info("Updating the repo to the origin main")
    cmd = ["git", "-C", profile_path, "status", "--porcelain"]
    res = subprocess.run(cmd, capture_output=True)
    if res.returncode != 0:
        raise Exception(
            f"Not able to check the status of the repo - Error: {res.returncode}"
        )
    if res.stdout.strip() != b"":
        raise Exception(f"Repo is not clean - {res.stdout}")
    cmd = ["git", "-C", profile_path, "fetch", "--all"]
    res = subprocess.run(cmd, capture_output=True)
    if res.returncode != 0:
        raise Exception(f"Not able to fetch the repo - Error: {res.returncode}")
    cmd = ["git", "-C", profile_path, "checkout", "origin/main"]
    res = subprocess.run(cmd, capture_output=True)
    if res.returncode != 0:
        raise Exception(
            f"Not able to checkout the remote origin main - Error: {res.returncode}"
        )
