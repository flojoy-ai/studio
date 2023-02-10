from PYTHON.dao.redis_dao import RedisDao
from rq import Queue
from rq.job import Job
from rq.exceptions import NoSuchJobError
import traceback
from PYTHON.common.CONSTANTS import KEY_FLOJOY_WATCH_JOBS, KEY_RQ_WORKER_JOBS, KEY_ALL_JOBEST_IDS
from rq.command import send_stop_job_command
from rq.exceptions import InvalidJobOperation, NoSuchJobError


class JobService():
    def __init__(self, queue_name):
        self.redis_service = RedisDao()
        self.queue = Queue(queue_name, connection=self.redis_service.r)

    @classmethod
    def get_all_jobs(self):
        all_jobs = self.redis_service.get_redis_obj(KEY_RQ_WORKER_JOBS)
        return all_jobs

    def delete_all_rq_worker_jobs(self):
        all_jobs = self.get_all_jobs()
        if all_jobs:
            for key in all_jobs.keys():
                try:
                    job = Job.fetch(
                        all_jobs[key], connection=self.redis_service.r)
                except (Exception, NoSuchJobError):
                    print(' Failed to cancel job: ', all_jobs[key])
                    print(Exception, traceback.format_exc())
                    return True
                if job is not None:
                    print('Deleting job: ', job.get_id())
                    job.delete()
            print("JOB DELETE OK")
        self.redis_service.delete_redis_object(KEY_RQ_WORKER_JOBS)

    def add_flojoy_watch_job_id(self, flojoy_watch_job_id):
        self.redis_service.add_to_list(
            KEY_FLOJOY_WATCH_JOBS, flojoy_watch_job_id)

    def delete_all_jobset_data(self):
        all_running_jobest_ids = self.redis_service.get_list(
            KEY_ALL_JOBEST_IDS)
        for jobset_id in all_running_jobest_ids:
            jobset_node_keys = f"{jobset_id}_ALL_NODES"
            self.redis_service.delete_redis_object(jobset_node_keys)

    def add_jobset_id(self, jobset_id):
        self.redis_service.add_to_list(KEY_ALL_JOBEST_IDS, jobset_id)

    def stop_flojoy_watch_jobs(self):
        jobs = self.redis_service.get_list(KEY_FLOJOY_WATCH_JOBS)
        if len(jobs) > 0:
            for job_id in jobs:
                try:
                    send_stop_job_command(
                        connection=self.redis_service.r, job_id=job_id.decode('utf-8'))
                # if job is currently not executing (e.g. finished, etc.), ignore the exception
                except (InvalidJobOperation, NoSuchJobError):
                    pass
                self.redis_service.remove_item_from_list(
                    KEY_FLOJOY_WATCH_JOBS, job_id.decode('utf-8'))
            for job_id in self.queue.failed_job_registry.get_job_ids():
                self.queue.delete(job_id)
