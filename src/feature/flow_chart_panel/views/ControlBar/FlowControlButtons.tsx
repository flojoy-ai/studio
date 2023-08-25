// import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { Node, Edge } from "reactflow";
import { ElementsData } from "@/types";
import { Ban, Play } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { projectAtom, useFlowChartState } from "@src/hooks/useFlowChartState";
import { useSettings } from "@src/hooks/useSettings";
import { useSocket } from "@src/hooks/useSocket";
import {
  saveFlowChartToLocalStorage,
  saveAndRunFlowChartInServer,
  cancelFlowChartRun,
} from "@src/services/FlowChartServices";
import { sendProgramToMix } from "@src/services/MixpanelServices";
import { IServerStatus } from "@src/context/socket.context";
import WatchBtn from "./WatchBtn";
import { useAtom } from "jotai";

const FlowControlButtons = () => {
  const { states } = useSocket();
  const { socketId, serverStatus } = states;

  const { settings } = useSettings("backend");

  const { setNodeParamChanged } = useFlowChartState();

  const [project, setProject] = useAtom(projectAtom);

  const playBtnDisabled =
    serverStatus === IServerStatus.CONNECTING ||
    serverStatus === IServerStatus.OFFLINE;
  const cancelFC = () => {
    if (project.rfInstance && project.rfInstance.nodes.length > 0) {
      cancelFlowChartRun(project.rfInstance, socketId);
    } else {
      alert("There is no running job on server.");
    }
  };
  const onRun = async (nodes: Node<ElementsData>[], edges: Edge[]) => {
    if (project.rfInstance && project.rfInstance.nodes.length > 0) {
      // Only update the react flow instance when required.
      const updatedRfInstance = {
        ...project.rfInstance,
        nodes,
        edges,
      };

      setProject({
        ...project,
        rfInstance: updatedRfInstance,
      });

      saveFlowChartToLocalStorage(updatedRfInstance);
      sendProgramToMix(project.rfInstance.nodes, true, false);
      // setProgramResults([]);
      saveAndRunFlowChartInServer({
        rfInstance: updatedRfInstance,
        jobId: socketId,
        settings: settings.filter((setting) => setting.group === "backend"),
      });
      setNodeParamChanged(false);
    } else {
      alert(
        "There is no program to send to server. \n Please add at least one node first.",
      );
    }
  };
  const { nodes, edges } = useFlowChartGraph();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    onRun(nodes, edges);
  };

  // useKeyboardShortcut("ctrl", "p", () => onPlay(nodes, edges));
  // useKeyboardShortcut("meta", "p", () => onPlay(nodes, edges));

  return (
    <>
      {playBtnDisabled || serverStatus === IServerStatus.STANDBY ? (
        <Button
          data-cy="btn-play"
          size="sm"
          variant="default"
          id="btn-play"
          onClick={handleClick}
          disabled={nodes.length === 0}
          className="gap-2"
        >
          <Play size={18} />
          Play
        </Button>
      ) : (
        <Button
          data-testid="btn-cancel"
          data-cy="btn-cancel"
          size="sm"
          id="btn-cancel"
          onClick={cancelFC}
          className="gap-2"
          variant="ghost"
        >
          <Ban size={18} />
          Cancel
        </Button>
      )}

      <div className="px-0.5" />
      <WatchBtn playFC={onRun} cancelFC={cancelFC} />
      <div className="px-0.5" />
    </>
  );
};

export default FlowControlButtons;
