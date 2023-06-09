import json
import networkx as nx
from networkx.readwrite import json_graph
import copy


class Topology:
    def __init__(self, graph: nx.DiGraph | None) -> None:
        if graph is not None:
            self.original_graph = copy.deepcopy(graph)
            self.working_graph = copy.deepcopy(graph)
        self.scheduled_jobs = set()
        self.finished_jobs = set()
        self.jobq = []
        self.is_finished = False

    def to_json(self) -> str:
        state = {
            "original_graph": json.dumps(
                json_graph.node_link_data(self.original_graph)
            ),
            "working_graph": json.dumps(json_graph.node_link_data(self.working_graph)),
            "scheduled_jobs": list(self.scheduled_jobs),
            "finished_jobs": list(self.finished_jobs),
            "jobq": self.jobq,
            "is_finished": self.is_finished,
        }
        return json.dumps(state)

    def from_json(self, state_str: dict):
        state = json.loads(state_str)
        self.original_graph = json_graph.node_link_graph(
            json.loads(state["original_graph"])
        )
        self.working_graph = json_graph.node_link_graph(
            json.loads(state["working_graph"])
        )
        self.scheduled_jobs = set(state["scheduled_jobs"])
        self.finished_jobs = set(state["finished_jobs"])
        self.jobq = state["jobq"]
        self.is_finished = state["is_finished"]

    def get_working_graph(self):
        return self.working_graph

    def collect_ready_jobs(self):
        print("collect ready jobs")
        for job_id in list(self.working_graph.nodes):
            self.add_to_jobq_if_ready(job_id)

    def restart(self, job_id):
        print("  *** restarting job:", self.get_label(job_id, original=True))

        # has to reconstruct all edges from the entire subgraph rooted in job_id
        # which means, to copy the edges from the original graph into working graph
        graph = self.original_graph
        sub_graph = graph.subgraph([job_id] + list(nx.descendants(graph, job_id)))
        original_edges = sub_graph.edges
        original_edges = [
            (s, t, self.original_graph.get_edge_data(s, t)) for (s, t) in original_edges
        ]

        # reconstructing edges in working graph
        self.working_graph.add_edges_from(original_edges)

        # has to clear all the nodes in the subgraph from being scheduled or finished
        self.scheduled_jobs.remove(job_id)
        self.finished_jobs.remove(job_id)
        # clear the descendants as well
        for d_id in nx.descendants(self.working_graph, job_id):
            try:
                self.scheduled_jobs.remove(job_id)
                self.finished_jobs.remove(d_id)
            except Exception:
                pass

        print(
            "   after reconstruction, all descendants for job id:",
            self.get_label(job_id),
            "are:",
            [
                self.get_label(d_id)
                for d_id in nx.descendants(self.working_graph, job_id)
            ],
        )

    def copy_node_from_original(self, node_ids):
        for node_id in node_ids:
            node_data = self.original_graph.nodes[node_id]
            self.working_graph.add_node(node_data["id"], **node_data)

    def mark_job_success(self, job_id, label="main"):
        print(f"  job finished: {self.get_label(job_id)}, label:", label)
        self.remove_dependencies(job_id, label)
        self.finished_jobs.add(job_id)
        if self.get_cmd(job_id) == "END":
            self.is_finished = True
        # self.working_graph.remove_node(job_id)

    def mark_job_failure(self, job_id):
        self.finished_jobs.add(job_id)
        print(f"  job {self.get_label(job_id)} failed")

    def remove_dependencies(self, job_id, label="main"):
        edges = self.get_edges_by_label(job_id, label)
        for edge in edges:
            self.remove_dependency(edge[0], edge[1])

    def get_edges_by_label(self, job_id, label):
        edges = self.working_graph.edges(job_id)
        edges = [(s, t, self.working_graph.get_edge_data(s, t)) for (s, t) in edges]
        edges = [
            (s, t, data) for (s, t, data) in edges if data.get("label", "") == label
        ]
        return edges

    def remove_dependency(self, job_id, succ_id):
        if self.working_graph.has_edge(job_id, succ_id):
            print(
                f"  - remove dependency: {self.get_edge_label_string(job_id, succ_id)}"
            )
            self.working_graph.remove_edge(job_id, succ_id)

    def add_to_jobq_if_ready(self, job_id):
        """
        Checks if the provided job has any dependencies (no incoming edge).
        If it doesn't, then prepares the job_id for the next run
        """

        if job_id in self.finished_jobs or job_id in self.scheduled_jobs:
            return

        deps = self.get_job_dependencies(job_id)
        deps_str = [self.get_label(dep) for dep in deps]
        print(
            " * check readiness for",
            self.get_label(job_id),
            "- remaining dependencies:",
            deps_str,
        )

        if deps is not None and len(deps) <= 0:
            print(" + add", self.get_label(job_id), "in jobq")
            self.jobq.append(job_id)
            self.scheduled_jobs.add(job_id)

    def get_job_dependencies(self, job_id, original=False):
        graph = self.get_graph(original)
        try:
            return list(graph.predecessors(job_id))
        except Exception:
            return []

    def finished(self):
        print(
            f"jobset finished: {self.is_finished}, num of nodes in graph:",
            len(self.finished_jobs),
        )
        return self.is_finished

    def next_jobs(self):
        return self.jobq.copy()

    def clear_jobq(self):
        self.jobq.clear()

    def get_graph(self, original):
        return self.original_graph if original else self.working_graph

    def get_label(self, job_id, original=False):
        graph = self.get_graph(original)
        if graph.has_node(job_id):
            return graph.nodes[job_id].get("label", job_id)
        else:
            print("get_label: job_id", job_id, "not found in original:", original)
        return job_id

    def get_cmd(self, job_id, original=False):
        graph = self.get_graph(original)
        if graph.has_node(job_id):
            return graph.nodes[job_id].get("cmd", job_id)
        else:
            print("get_label: job_id", job_id, "not found in original:", original)
        return job_id

    def print_edges(self, edges, prefix="", original=False):
        edges_str = [
            self.get_edge_label_string(s, t, original=original) for (s, t, _) in edges
        ]
        print(prefix, edges_str)

    def get_edge_label_string(
        self, source_job_id, target_job_id, label=None, original=False
    ):
        graph = self.get_graph(original)
        if label is None:
            edge_data = graph.get_edge_data(source_job_id, target_job_id)

            label = "" if edge_data is None else edge_data.get("label", "")
        s = self.get_label(source_job_id, original=original)
        t = self.get_label(target_job_id, original=original)
        return f"{s} -- {label} --> {t}"

    def print_graph(self, prefix=None, original=False):
        graph = self.get_graph(original)
        if prefix is None:
            prefix = "working graph:" if not original else "original graph:"
        nodes = [
            self.get_label(node_id, original=original) for node_id in list(graph.nodes)
        ]
        edges = list(graph.edges.data())

        edges_str = [
            self.get_edge_label_string(s, t, original=original) for (s, t, _) in edges
        ]

        print(
            prefix,
            "\nnodes:",
            json.dumps(nodes, indent=2),
            "\nedges:",
            json.dumps(edges_str, indent=2),
            "\nfinished_jobs:",
            list(self.finished_jobs),
            "\nis_finished:",
            self.is_finished,
        )

    def print_jobq(self, prefix=""):
        jobq_str = [self.get_label(job_id) for job_id in self.jobq]
        print(f"{prefix}jobq:", jobq_str)

    def print_id_to_label_mapping(self, original=False):
        graph = self.get_graph(original=original)
        for node_id in graph.nodes():
            label = self.get_label(node_id)
            print(f"{label} ------ {node_id}")
