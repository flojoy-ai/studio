from dao.redis_dao import RedisDao
from rq import Queue
from rq.job import Job
from rq.exceptions import NoSuchJobError
import traceback
from common.CONSTANTS import KEY_FLOJOY_WATCH_JOBS, KEY_RQ_WORKER_JOBS, KEY_ALL_JOBEST_IDS
from rq.command import send_stop_job_command
from rq.exceptions import InvalidJobOperation, NoSuchJobError

def report_failure(job, connection, type, value, traceback):
    print(job, connection, type, value, traceback)

class JobService():
    def __init__(self, queue_name):
        self.redis_dao = RedisDao()
        self.queue = Queue(queue_name, connection=self.redis_dao.r)

    def get_all_jobs(self):
        all_jobs = self.redis_dao.get_redis_obj(KEY_RQ_WORKER_JOBS)
        return all_jobs

    def delete_all_rq_worker_jobs(self):
        all_jobs = self.get_all_jobs()
        if all_jobs:
            for key in all_jobs.keys():
                try:
                    job = Job.fetch(
                        all_jobs[key], connection=self.redis_dao.r)
                except (Exception, NoSuchJobError):
                    print(' Failed to cancel job: ', all_jobs[key])
                    print(Exception, traceback.format_exc())
                    return True
                if job is not None:
                    print('Deleting job: ', job.get_id())
                    job.delete()
            print("JOB DELETE OK")
        self.redis_dao.delete_redis_object(KEY_RQ_WORKER_JOBS)

    def add_flojoy_watch_job_id(self, flojoy_watch_job_id):
        self.redis_dao.add_to_list(
            KEY_FLOJOY_WATCH_JOBS, flojoy_watch_job_id)

    def delete_all_jobset_data(self):
        all_running_jobest_ids = self.redis_dao.get_list(
            KEY_ALL_JOBEST_IDS)
        for jobset_id in all_running_jobest_ids:
            jobset_node_keys = f"{jobset_id}_ALL_NODES"
            self.redis_dao.delete_redis_object(jobset_node_keys)

    def add_jobset_id(self, jobset_id):
        self.redis_dao.add_to_list(KEY_ALL_JOBEST_IDS, jobset_id)

    def stop_flojoy_watch_jobs(self):
        jobs = self.redis_dao.get_list(KEY_FLOJOY_WATCH_JOBS)
        if len(jobs) > 0:
            for job_id in jobs:
                try:
                    send_stop_job_command(
                        connection=self.redis_dao.r, job_id=job_id.decode('utf-8'))
                # if job is currently not executing (e.g. finished, etc.), ignore the exception
                except (InvalidJobOperation, NoSuchJobError):
                    pass
                self.redis_dao.remove_item_from_list(
                    KEY_FLOJOY_WATCH_JOBS, job_id.decode('utf-8'))
            for job_id in self.queue.failed_job_registry.get_job_ids():
                self.queue.delete(job_id)

    def add_to_redis_obj(self, key: str, value: dict):
        self.redis_dao.set_redis_obj(key, value)

    def get_jobset_data(self, key: str):
        return self.redis_dao.get_redis_obj(key)

    def enqueue_job(self, func, jobset_id, job_id, iteration_id, ctrls, previous_job_ids, input_job_ids=None):
        input_job_ids = input_job_ids if input_job_ids is not None else previous_job_ids
        job = self.queue.enqueue(func,
                job_timeout='3m',
                on_failure=report_failure,
                job_id=iteration_id,
                kwargs={'ctrls': ctrls,
                        'previous_job_ids': input_job_ids,
                        'jobset_id': jobset_id, 'node_id': job_id, 'job_id': iteration_id},
                depends_on=previous_job_ids
                # result_ttl=500
            )
        self.add_job(iteration_id, jobset_id)

        print('enqueued job successfully')
        return job

    def add_job(self, job_id, jobset_id):
        self.redis_dao.add_to_list(f"{jobset_id}_ALL_NODES", job_id) 
    
    def fetch_job(self, job_id):
        try:
            return Job.fetch(job_id, connection=self.redis_dao.r)
        except Exception:
            return None