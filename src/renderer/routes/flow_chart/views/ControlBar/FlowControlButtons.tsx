import { Ban, Play } from "lucide-react";
import { Button } from "@/renderer/components/ui/button";
import { useSocket } from "@/renderer/hooks/useSocket";
import { sendProgramToMix } from "@/renderer/services/MixpanelServices";
import { ServerStatus } from "@/renderer/types/socket";
import WatchBtn from "./WatchBtn";
import useKeyboardShortcut from "@/renderer/hooks/useKeyboardShortcut";
import { useManifest } from "@/renderer/stores/manifest";
import _ from "lodash";
import { toast } from "sonner";
import { useFlowchartStore } from "@/renderer/stores/flowchart";
import { useProjectStore } from "@/renderer/stores/project";
import { useShallow } from "zustand/react/shallow";
import { useSettingsStore } from "@/renderer/stores/settings";
import { runFlowchart, cancelFlowchartRun } from "@/renderer/lib/api";

const FlowControlButtons = () => {
  const { socketId, serverStatus, wipeBlockResults } = useSocket();

  const backendSettings = useSettingsStore((state) => state.backend);

  const resetNodeParamChanged = useFlowchartStore(
    useShallow((state) => state.resetNodeParamChanged),
  );
  const { nodes, edges } = useProjectStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
    })),
  );

  const manifest = useManifest();

  const playBtnDisabled =
    serverStatus === ServerStatus.CONNECTING ||
    serverStatus === ServerStatus.OFFLINE;

  const onRun = async () => {
    if (nodes.length === 0) {
      toast.info(
        "There is no program to send to server. \n Please add at least one node first.",
      );
      return;
    }
    if (_.some(nodes, (n) => n.data.invalid)) {
      toast.error(
        "Unknown blocks found, these must be removed before attempting to run the flow chart.",
      );
      return;
    }

    sendProgramToMix(nodes, true, false);
    wipeBlockResults();

    const res = await runFlowchart({
      nodes,
      edges,
      jobId: socketId,
      settings: backendSettings,
    });
    if (res.isErr()) {
      toast.error("Failed to run flowchart", {
        description: res.error.message,
      });
    }

    resetNodeParamChanged();
  };

  useKeyboardShortcut("ctrl", "p", onRun);
  useKeyboardShortcut("meta", "p", onRun);

  return (
    <>
      {playBtnDisabled || serverStatus === ServerStatus.STANDBY ? (
        <Button
          data-cy="btn-play"
          data-testid="btn-play"
          variant="dotted"
          id="btn-play"
          onClick={(e) => {
            e.preventDefault();
            onRun();
          }}
          disabled={nodes.length === 0 || !manifest}
          className="w-28 gap-2"
        >
          <Play size={18} />
          Play
        </Button>
      ) : (
        <Button
          data-testid="btn-cancel"
          data-cy="btn-cancel"
          id="btn-cancel"
          onClick={() => cancelFlowchartRun(socketId)}
          className="w-28 gap-2"
          variant="dotted"
        >
          <Ban size={18} />
          Cancel
        </Button>
      )}

      <div className="px-0.5" />
      <WatchBtn playFC={onRun} cancelFC={() => cancelFlowchartRun(socketId)} />
      <div className="px-0.5" />
    </>
  );
};

export default FlowControlButtons;
