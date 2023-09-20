import unittest
from queue import Queue
from .test_apps.sample_app import graph as sample_app_graph
from captain.models.topology import Topology
from captain.types.worker import JobInfo



class TopologyTest(unittest.TestCase):
  topology = Topology(graph=sample_app_graph, jobset_id="test_123")
  # test that nodes are added to given task_queue
  def test_nodes_in_queue(self):
    task_queue = Queue()   
    self.topology.run(task_queue=task_queue)
    assert task_queue.empty() == False
    job = task_queue.get()
    assert isinstance(job, JobInfo)
    assert sample_app_graph.nodes.get(job.job_id) != None
    
  
  # test that maximum independent worker_count is returned correctly 
  def test_maximum_worker_count(self):
    worker_count = self.topology.get_maximum_workers(4)
    assert worker_count == 2
    
  # test that ready_jobs are returned correctly    
  def test_collect_ready_jobs(self):
    ready_jobs = self.topology.collect_ready_jobs()
    assert ready_jobs.__len__() == 1
    assert ready_jobs[0].startswith("LINSPACE")
    
    
      



