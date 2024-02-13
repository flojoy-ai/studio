from flojoy import flojoy, String, Boolean, File, get_env_var, DataContainer, Secret
from typing import Optional, Literal
import boto3
import logging
import os



@flojoy(
    deps={
        "boto3": "1.34.21",
    }
)
def EXPORT_S3(
    object_name: Optional[String] = None,
    s3_secret_key: Secret = Secret(""),
    s3_access_key: str = "",
    bucket: str = "",
    region: Literal[
        "us-east-1",
        "us-east-2",
        "us-west-1",
        "us-west-2",
        "ca-central-1",
        "ca-west-1",
        "eu-north-1",
        "eu-west-3",
        "eu-west-2",
        "eu-west-1",
        "eu-central-1",
        "eu-south-1",
        "ap-south-1",
        "ap-northeast-1",
        "ap-northeast-2",
        "ap-northeast-3",
        "ap-southeast-1",
        "ap-southeast-2",
        "ap-southeast-3",
        "ap-east-1",
        "sa-east-1",
        "cn-north-1",
        "cn-northwest-1",
        "us-gov-east-1",
        "us-gov-west-1",
        "us-isob-east-1",
        "us-iso-east-1",
        "us-iso-west-1",
        "me-south-1",
        "af-south-1",
        "me-central-1",
        "eu-south-2",
        "eu-central-2",
        "ap-south-2",
        "ap-southeast-4",
        "il-central-1",
    ] = "us-east-1",
    enable_overwrite: bool = False,
    file: File = None,
    default: Optional[DataContainer] = None,
) -> Boolean:
    """Export a file to S3 Bucket.

    This function exports a file to an S3 bucket using the provided credentials and options.
    The user must have previously set the AWS access and secret access keys in the Environment Variables settings and have enabled the required permissions for such operations.

    Parameters
    ----------
    object_name: Optional[String]
        Flojoy input to dynamically provide a string for the name of the object in S3. If not specified, the name of the file will be used.
    s3_access_key : str
        The name of the key used to save the AWS access key.
    s3_secret_key : str
        The name of the key used to save the AWS secret key.
    bucket : str
        The S3 bucket to upload the file to.
    region : str
        The AWS region (default is "us-east-1").
    enable_overwrite : bool, optional
        Whether to overwrite the file if it already exists (default is False).
    file : File
        The file to be uploaded to the S3 bucket.

    Returns
    -------
    Boolean
        Returns a Boolean indicating the success of the file export operation (True if successful, False otherwise).
    """

    access_key = get_env_var(s3_access_key)
    secret_key = get_env_var(s3_secret_key)

    s3_client = boto3.Session(
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region,
    ).client("s3")

    # Some checks
    filename = file.unwrap()
    # Check if the bucket exist. Need the `s3:ListAllMyBuckets` permission, don't block the user if it doesn't have it.
    try:
        buckets = [b["Name"] for b in s3_client.list_buckets()["Buckets"]]
        if bucket not in buckets:
            raise ValueError(
                f"Bucket {bucket} does not exist. Available buckets: {' '.join(buckets)}"
            )
        logging.info(f"object_name: {object_name}")
    except Exception:
        pass
    if object_name is not None:
        object_name = object_name.s
    else:
        object_name = filename.split(os.sep)[-1]

    # Check if the file already exists in S3
    if not enable_overwrite:
        try:
            # Throw an error "Not found" if the file doesn't exists
            s3_client.head_object(Bucket=bucket, Key=object_name)
            logging.info(
                f"File {object_name} already exists in bucket {bucket}. Use enable_overwrite=True to overwrite it."
            )
            return Boolean(False)
        except Exception as err:
            if "Not Found" in str(err):
                logging.info("File does not exist, proceding to upload")
            else:
                raise err

    # Upload the file
    s3_client.upload_file(filename, bucket, object_name)

    return Boolean(True)
