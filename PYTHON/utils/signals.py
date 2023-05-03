class Signals:
    def __init__(self) -> None:
        self.signal_states = {}
        self.signal_iterations = {}
        self.all_node_signals = (
            {}
        )  # {child_id -> {(parent_id, direction)] -> signal_id}

    def update_child_signals(self, child_id, node_id, direction):
        child_signals = self.all_node_signals.get(child_id, {})
        child_signals[(node_id, direction)] = self.get_latest_signal(node_id, direction)
        self.all_node_signals[child_id] = child_signals

    def get_child_signal_ids(self, child_id):
        child_signals = self.all_node_signals.get(child_id, {})
        return [signal for _, signal in child_signals.items()]

    def are_signals_on(self, child_id):
        child_signal_ids = self.get_child_signal_ids(child_id)
        off_signals = [
            signal
            for signal in child_signal_ids
            if not self.signal_states.get(signal, False)
        ]

        return len(off_signals) == 0
