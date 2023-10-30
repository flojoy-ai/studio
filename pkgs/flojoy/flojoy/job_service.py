from typing import Any
from .dao import Dao

"""
Service that allows to manage jobs
"""


class JobService:
    def __init__(self, maximum_runtime: float = 3000):
        self.dao = Dao.get_instance()

    def get_job_result(self, job_id: str | None) -> dict[str, Any] | None:
        if job_id is None:
            return None
        return self.dao.get_job_result(job_id)

    def post_job_result(self, job_id: str, result: Any):
        self.dao.post_job_result(job_id, result)

    def job_exists(self, job_id: str) -> bool:
        return self.dao.job_exists(job_id)

    def delete_job(self, job_id: str):
        self.dao.delete_job(job_id)

    def reset(self):
        self.dao.clear_job_results()
        self.dao.clear_small_memory()
