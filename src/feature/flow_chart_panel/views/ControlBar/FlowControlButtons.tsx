// import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { Node, Edge } from "reactflow";
import { ElementsData } from "@/types";
import { Ban, Play, Upload } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { projectAtom, useFlowChartState } from "@src/hooks/useFlowChartState";
import { useSettings } from "@src/hooks/useSettings";
import { useSocket } from "@src/hooks/useSocket";
import {
  saveAndRunFlowChartInServer,
  cancelFlowChartRun,
  ServerSendAction,
  uploadFlowChartToMicrocontroller,
} from "@src/services/FlowChartServices";
import { sendProgramToMix } from "@src/services/MixpanelServices";
import { IServerStatus } from "@src/context/socket.context";
import WatchBtn from "./WatchBtn";
import MicrocontollerBtn from "./MicrocontrollerBtn";
import { useAtom } from "jotai";
import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import PortSelect from "./PortSelect";
import PingMCBtn from "./PingMCBtn";
import { useState } from "react";
import LoadingCircle from "../../components/LoadingCircle/LoadingCircle";
import { FirmwareBoardSelectModal } from "./FirmwareBoardSelect/FirmwareBoardSelectModal";

const FlowControlButtons = () => {
  const { states } = useSocket();
  const { socketId, serverStatus } = states;

  const { settings: backendSettings } = useSettings("backend");
  const { settings: mcSettings } = useSettings("micropython");

  const [isLoadingPing, setIsLoadingPing] = useState(false);

  const { setNodeParamChanged, isMicrocontrollerMode } = useFlowChartState();

  const [project, setProject] = useAtom(projectAtom);

  const playBtnDisabled =
    serverStatus === IServerStatus.CONNECTING ||
    serverStatus === IServerStatus.OFFLINE;
  const cancelFC = () => {
    if (project.rfInstance && project.rfInstance.nodes.length > 0) {
      cancelFlowChartRun(project.rfInstance, socketId);
    } else {
      alert("is no running job on server.");
    }
  };


  const onRun = async (
    nodes: Node<ElementsData>[],
    edges: Edge[],
    action: ServerSendAction,
  ) => {
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

      sendProgramToMix(project.rfInstance.nodes, true, false);
      action({
        rfInstance: updatedRfInstance,
        jobId: socketId,
        settings: backendSettings,
        isMicrocontrollerMode,
        mcSettings,
      });
      setNodeParamChanged(false);
    } else {
      alert(
        "There is no program to send to server. \n Please add at least one node first.",
      );
    }
  };

  const [isBoardSelect, setIsBoardSelect] = useState(false);

  const { nodes, edges } = useFlowChartGraph();

  const onPlay = async () => {
    onRun(nodes, edges, saveAndRunFlowChartInServer);
  };

  const onUpload = async () => {
    onRun(nodes, edges, uploadFlowChartToMicrocontroller);
  };

  useKeyboardShortcut("ctrl", "p", onPlay);
  useKeyboardShortcut("meta", "p", onPlay);

  return (
    <>
      {/* Modal components here: */}
      <FirmwareBoardSelectModal
        handleBoardFirmwareModalOpen={setIsBoardSelect}
        isBoardFirmwareModalOpen={isBoardSelect}
        title="Board Firmware Select"
        description="Select board type for firmware upload"
      />

      {/* Normal components here: */}
      {playBtnDisabled ||
      [IServerStatus.STANDBY, IServerStatus.UPLOAD_COMPLETE].includes(
        serverStatus,
      ) ? (
        <>
          <Button
            data-cy="btn-play"
            size="sm"
            variant="default"
            id="btn-play"
            onClick={onPlay}
            disabled={nodes.length === 0}
            className="gap-2"
          >
            <Play size={18} />
            Play
          </Button>
          {isMicrocontrollerMode && (
            <Button
              data-cy="btn-upload"
              size="sm"
              variant="default"
              id="btn-play"
              onClick={onUpload}
              disabled={nodes.length === 0}
              className="gap-2"
            >
              <Upload size={18} />
              Upload
            </Button>
          )}
        </>
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
      {!isMicrocontrollerMode && (
        <WatchBtn playFC={onPlay} cancelFC={cancelFC} />
      )}
      <MicrocontollerBtn />

      {isMicrocontrollerMode && (
        <>
          {/* Button for firmware select */}
          <Button
            data-cy="btn-firmware"
            size="sm"
            variant="default"
            id="btn-firmware"
            onClick={() => {setIsBoardSelect(true)}}
            className="gap-2"
          >
            Firmware
          </Button>
          <PortSelect />
          {!isLoadingPing && <PingMCBtn setIsLoadingPing={setIsLoadingPing} />}
          {isLoadingPing && <LoadingCircle />}
        </>
      )}
      <div className="px-0.5" />
    </>
  );
};

export default FlowControlButtons;
