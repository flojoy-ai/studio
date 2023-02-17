
import networkx as nx
import pytest
from utils.topology import Topology

class TestTopologyBase:

    def set_topology(self, graph=None):
        self.graph = graph if graph is not None else nx.DiGraph(
            [(1, 2), (2, 3), (3, 1)])
        self.topology = Topology(self.graph)

    def get_working_graph(self):
        return self.topology.get_working_graph()

    def print_working_graph(self):
        print('nodes:', self.get_working_graph().nodes,
              'edges:', self.get_working_graph().edges)

    def assert_jobs_in_queue(self, jobs):
        for job in jobs:
            assert job in self.topology.next_jobs()

class Test_mark_job_done(TestTopologyBase):

    def test_removes_all_outgoing_edges(self):
        # arrange
        self.set_topology()

        # act
        self.topology.mark_job_done(2)

        # assert
        assert self.get_working_graph().has_edge(2, 3) is False

    def test_removes_successors_with_no_incoming_edges(self):
        # arrange
        self.set_topology()

        # act
        self.topology.mark_job_done(2)

        # assert
        assert self.get_working_graph().has_node(3) is False

    @pytest.mark.parametrize("graph, expected_new_jobs", [
        (
            nx.DiGraph([(1, 2), (2, 3)]), # graph
            [3] # expected_new_jobs
        ),
        (
            nx.DiGraph([(1, 2), (2, 3), (3, 1)]), # graph
            [3] # expected_new_jobs
        ),
    ])
    def test_adds_successors_with_no_incoming_edge_into_jobq(
            self,
            graph,
            expected_new_jobs
    ):
        # arrange
        self.set_topology(graph)

        # act
        self.topology.mark_job_done(2)

        # assert
        self.assert_jobs_in_queue(expected_new_jobs)


class Test_restart(TestTopologyBase):

    def test_adds_the_subtree_back(self):
        # arrange
        self.set_topology()

        # act
        self.topology.mark_job_done(2)
        self.topology.restart(2)

        # assert
        assert self.get_working_graph().has_edge(2, 3) is False