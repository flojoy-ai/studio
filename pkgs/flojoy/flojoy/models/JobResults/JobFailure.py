from .JobFeedback import JobFeedback

__all__ = ["JobFailure"]


class JobFailure(JobFeedback):
    def __init__(self, func_name, node_id, error, jobset_id):
        super().__init__(jobset_id)
        self.func_name = func_name
        self.node_id = node_id
        self.error = error
