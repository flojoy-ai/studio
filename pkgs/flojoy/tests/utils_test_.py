import os
import shutil
import tempfile
import pytest


def _search_for_file_recursively(dir: str, file_name: str) -> list[str]:
    """Search for a file recursively in a directory"""
    matches = []
    for root, dirnames, filenames in os.walk(dir):
        for filename in filenames:
            if filename == file_name:
                matches.append(os.path.join(root, filename))
    return matches


@pytest.fixture
def temp_cache_dir():
    """ " Mock out the path of the hub cache"""
    _test_tempdir = os.path.join(tempfile.gettempdir(), "test_flojoy_hf_hub_cache")
    # Wipe the directory to be patched if it exists
    shutil.rmtree(_test_tempdir, ignore_errors=True)
    os.makedirs(_test_tempdir)
    # Patch the tempfile.tempdir
    yield _test_tempdir
    # Clean up
    shutil.rmtree(_test_tempdir)


# @patch("flojoy.utils.hf_hub_download")
# @patch("flojoy.utils.get_hf_hub_cache_path")
# def test_hf_hub_download_wraps(
#     mock_get_hf_hub_cache_path, mock_wrapped_hf_hub_download, temp_cache_dir
# ):
#     """Test that hf_hub_download wraps the original hf_hub_download properly"""
#     mock_get_hf_hub_cache_path.return_value = temp_cache_dir
#     mock_wrapped_hf_hub_download.side_effect = lambda *args, **kwargs: os.path.join(
#         kwargs["cache_dir"], "test"
#     )
#     from flojoy import hf_hub_download
#
#     out_path = hf_hub_download("efgh")  # type: ignore
#     assert out_path == os.path.join(mock_get_hf_hub_cache_path.return_value, "test")


# @patch("flojoy.utils.get_hf_hub_cache_path")
# def test_hf_hub_download_writes(mock_get_hf_hub_cache_path, temp_cache_dir):
#     """Test that the original hf_hub_download writes the file to the right place in flojoy cache"""
#     mock_get_hf_hub_cache_path.return_value = temp_cache_dir
#     # from flojoy import hf_hub_download
#     #
#     # out_path = hf_hub_download(
#     #     repo_id="lysandre/arxiv-nlp",
#     #     filename="config.json",
#     #     revision="c7a2e68263d13db10671379c23cf2a8ea0e12789",
#     # )
#     # Test that there exists (recursively) a config.json file under mock_get_hf_hub_cache_path
#     assert (
#         len(
#             _search_for_file_recursively(
#                 mock_get_hf_hub_cache_path.return_value, "config.json"
#             )
#         )
#         == 1
#     )
