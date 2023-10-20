from .JobFeedback import JobFeedback

__all__ = ["JobSuccess"]


class JobSuccess(JobFeedback):
    def __init__(self, result, fn, node_id, jobset_id):
        super().__init__(jobset_id)
        self.result = result
        self.fn = fn
        self.node_id = node_id
        self.jobset_id = jobset_id
