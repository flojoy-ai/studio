import json


class Job:
    def __init__(self, iteration_id, dependency_iteration_ids, job_id, iteration_count ) -> None:
        self.iteration_id = iteration_id
        self.dependency_iteration_ids = dependency_iteration_ids
        self.job_id = job_id
        self.iteration_count = iteration_count

class JobQueue:

    def __init__(self, jobset_id) -> None:
        self.jobset_id = jobset_id
        self.job_iteration_counts = {}
        self.jobs: list[Job] = []

    def get_job_ids(self):
        return [job.job_id for job in self.jobs]

    def has_next(self):
        return len(self.jobs) > 0

    def add_job(self, job_id, dependency_job_ids):
        next_iteration_id = self._get_next_iteration_id(job_id)
        dependency_iteration_ids = [self._build_iteration_id(pid) for pid in dependency_job_ids]

        job = Job(
            iteration_id=next_iteration_id,
            dependency_iteration_ids=dependency_iteration_ids,
            job_id=job_id,
            iteration_count=self._get_current_iteration_count(job_id)
        )

        self.jobs = self.jobs + [job]

    def pop_job(self):
        return self.jobs.pop(0)

    def remove(self, job_id):
        print('removing job_id:', job_id)
        self.jobs = list(filter(lambda job: job.job_id != job_id, self.jobs))

    def _get_current_iteration_count(self, job_id):
        return self.job_iteration_counts.get(job_id, 0)

    def _get_next_iteration_id(self, job_id) -> str:
        '''
        given a node id, tracks the number of times it was run
        returns: a unique index for the next run (iteration)
        '''

        self.job_iteration_counts[job_id] = self.job_iteration_counts.get(job_id, 0) + 1

        return self._build_iteration_id(job_id)

    def _build_iteration_id(self, job_id, iteration_count=None):
        if iteration_count is None:
            iteration_count = self._get_current_iteration_count(job_id)
        return F'{str(job_id)}___{str(iteration_count)}'

    def log_state(self):
        state = [{
            'job_id': job.job_id,
            'iteration': job.iteration_id,
            'deps:': job.dependency_iteration_ids
        } for job in self.jobs]

        print("topology:", json.dumps(state, indent=2))

