import unittest
from queue import Queue
from .test_apps.sample_app import graph as sample_app_graph
from captain.models.topology import Topology
from captain.types.worker import JobInfo
from flojoy import JobSuccess


class TopologyTest(unittest.TestCase):
    # test that nodes are added to given task_queue
    def test_nodes_in_queue(self):
        task_queue = Queue()
        topology = Topology(graph=sample_app_graph, jobset_id="test_123")
        topology.run(task_queue=task_queue)
        print("task queue")
        assert task_queue.qsize != 0
        job = task_queue.get()
        assert isinstance(job, JobInfo)
        assert sample_app_graph.nodes.get(job.job_id) != None

    # test that maximum independent worker_count is returned correctly
    def test_maximum_worker_count(self):
        topology = Topology(graph=sample_app_graph, jobset_id="test_123")
        worker_count = topology.get_maximum_workers(4)
        assert worker_count == 2

    # test that ready_jobs are returned correctly
    def test_collect_ready_jobs(self):
        topology = Topology(graph=sample_app_graph, jobset_id="test_123")
        ready_jobs = topology.collect_ready_jobs()
        assert ready_jobs.__len__() == 1
        assert ready_jobs[0].startswith("LINSPACE")

    # test that when a job is finished new jobs are returned
    def test_new_jobs_returned(self):
        topology = Topology(graph=sample_app_graph, jobset_id="test_123")
        finished_job = JobSuccess(
            result=None,
            fn=lambda: None,
            node_id="LINSPACE-fb6e23f4-080c-4d26-9070-45f3081ee5f3",
            jobset_id="test_123",
        )
        new_jobs = topology.handle_finished_job(finished_job, return_new_jobs=True)
        assert new_jobs is not None
        assert len(new_jobs) != 0
