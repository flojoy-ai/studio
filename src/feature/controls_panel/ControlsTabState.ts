import { useState } from "react";
import { CtlManifestType } from "../../hooks/useFlowChartState";

export function useControlsTabState() {
    const [openEditModal, setOpenEditModal] = useState(false);
    const [currentInput, setCurrentInput] = useState<CtlManifestType & { index: number }>();
    const [debouncedTimerId, setDebouncedTimerId] = useState<NodeJS.Timeout | undefined>(undefined);

    return {
        openEditModal,
        setOpenEditModal,
        currentInput,
        setCurrentInput,
        debouncedTimerId,
        setDebouncedTimerId,
    };
}