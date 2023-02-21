
# import networkx as nx
# import pytest
# from utils.topology import Topology

# test_job_id = 2

# class TestTopologyBase:

#     def set_topology(self, graph=None):
#         self.graph = graph if graph is not None else nx.DiGraph(
#             [(1, 2), (2, 3), (3, 1)])
#         self.topology = Topology(self.graph)
#         self.topology.print_graph('topology -')

#     def get_working_graph(self):
#         return self.topology.get_working_graph()

#     def assert_jobq(self, jobs):
#         for job in jobs:
#             assert job in self.topology.next_jobs()
#         for job in self.topology.next_jobs():
#             assert job in jobs

#     def assert_jobs_in_queue(self, jobs):
#         for job in jobs:
#             assert job in self.topology.next_jobs()

#     def assert_jobs_not_in_queue(self, jobs):
#         for job in jobs:
#             assert job not in self.topology.next_jobs()

# class Test_mark_job_done(TestTopologyBase):

#     def test_removes_all_outgoing_edges(self):
#         # arrange
#         self.set_topology()
#         self.topology.collect_ready_jobs()

#         # act
#         self.topology.mark_job_success(test_job_id)

#         # assert
#         assert self.get_working_graph().has_edge(2, 3) is False

#     def test_removes_job_from_working_graph(self):
#         # arrange
#         self.set_topology()
#         self.topology.collect_ready_jobs()

#         # act
#         self.topology.mark_job_success(test_job_id)

#         # assert
#         assert self.get_working_graph().has_node(test_job_id) is False

#     @pytest.mark.parametrize("graph, job_id_to_mark_as_done, expected_new_jobs", [
#         (
#             nx.DiGraph([(1, 2), (2, 3)]), # graph
#             2, #job_id_to_mark_as_done
#             [1, 3] # expected_new_jobs
#         ),
#         (
#             nx.DiGraph([(1, 2), (2, 3), (3, 1)]), # graph
#             2, #job_id_to_mark_as_done
#             [3] # expected_new_jobs
#         ),
#     ])
#     def test_adds_successors_with_no_incoming_edge_into_jobq(
#             self,
#             graph,
#             job_id_to_mark_as_done,
#             expected_new_jobs
#     ):
#         # arrange
#         self.set_topology(graph)
#         self.topology.collect_ready_jobs()

#         # act
#         self.topology.mark_job_success(job_id_to_mark_as_done)

#         # assert
#         self.assert_jobq(expected_new_jobs)

#     def test_removes_job_from_jobq(self):
#         self.set_topology()
#         self.topology.collect_ready_jobs()

#         self.topology.mark_job_success(test_job_id)

#         self.assert_jobs_not_in_queue([2])


# class Test_restart(TestTopologyBase):

#     def test_adds_the_subtree_back(self):
#         # arrange
#         self.set_topology()

#         # act
#         self.topology.mark_job_success(test_job_id)
#         self.topology.print_graph('before restart:')
#         self.topology.restart(test_job_id)
#         self.topology.print_graph('after restart:')

#         # assert
#         assert self.get_working_graph().has_edge(2, 3) is True
#         assert self.get_working_graph().has_node(test_job_id) is True
#         assert self.get_working_graph().has_node(3) is True
