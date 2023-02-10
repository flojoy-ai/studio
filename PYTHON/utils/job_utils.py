from utils.redis_utils import RedisService
from rq.job import Job
import traceback

ALL_JOBS_KEY = "ALL_JOBS"


def get_all_jobs():
    all_jobs = RedisService.get_instance().get_redis_obj(ALL_JOBS_KEY)
    return all_jobs


def put_job():
    return


def delete_all_jobs():
    redis_service = RedisService.get_instance()
    all_jobs = get_all_jobs()
    if all_jobs:
        for key in all_jobs.keys():
            try:
                job = Job.fetch(all_jobs[key], connection=redis_service.r)
            except (Exception):
                print(' Failed to cancel job: ', all_jobs[key])
                print(Exception, traceback.format_exc())
                return True
            if job is not None:
                print('Deleting job: ', job.get_id())
                job.delete()
        print("JOB DELETE OK")
    RedisService.get_instance().delete_redis_object(ALL_JOBS_KEY)
