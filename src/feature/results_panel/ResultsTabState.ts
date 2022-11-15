import { useState } from "react";
import { useFlowChartState } from "../../hooks/useFlowChartState";

export function useResultsTabState() {
	const [resultElements, setResultElements] = useState<any[]>([]);
	const { rfInstance } = useFlowChartState();

	return {
		resultElements,
		setResultElements,
		rfInstance,
	};
}