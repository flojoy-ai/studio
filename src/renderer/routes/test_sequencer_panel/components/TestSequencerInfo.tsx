import { TestTable } from "./data-table/TestTable";
import { SequenceTable } from "./data-table/SequenceTable";
import { CloudPanel } from "./CloudPanel";
import { LockedContextProvider } from "@/renderer/context/lock.context";
import _ from "lodash";
import {
  LAYOUT_TOP_HEIGHT,
  BOTTOM_STATUS_BAR_HEIGHT,
  ACTIONS_HEIGHT,
} from "@/renderer/routes/common/Layout";
import { ModalsProvider } from "./modals/ModalsProvider";
import SequencerKeyboardShortcuts from "../SequencerKeyboardShortCuts";
import { ControlButton } from "./ControlButton";
import { DesignBar } from "./DesignBar";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";

const TestSequencerView = () => {
  const { backendGlobalState } = useTestSequencerState();

  return (
    <LockedContextProvider>
      <SequencerKeyboardShortcuts />
      <DesignBar />
      <div
        style={{
          height: ACTIONS_HEIGHT,
          position: "absolute",
          top: `calc(${LAYOUT_TOP_HEIGHT + ACTIONS_HEIGHT}px + 30px)`,
          right: "50px",
          zIndex: 10,
        }}
      >
        <ControlButton />
      </div>
      <div
        style={{
          height: `calc(100vh - ${LAYOUT_TOP_HEIGHT + BOTTOM_STATUS_BAR_HEIGHT + ACTIONS_HEIGHT}px)`,
        }}
        className="overflow-y-auto"
      >
        <ModalsProvider />
        <div className="flex">
          <div className="ml-auto mr-auto mt-2 h-3/5 flex-grow flex-col overflow-y-auto">
            <SequenceTable />
            <TestTable />
          </div>
          <div className="flex-none w-[442px]">
            <div className="ml-5 mt-5 rounded-lg border bg-card px-6 pb-3 pt-4 text-card-foreground shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <div className="h-14">
              { backendGlobalState !== "test_set_start" &&
                <div>
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                     Sequencer
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Execute and report to Flojoy Cloud
                  </p>
                </div>
              }
              </div>
              <div className="flex flex-col">
                <hr className="my-3" />
                <div className="grid grid-cols-1 place-items-center gap-4 py-2">
                  <CloudPanel />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LockedContextProvider>
  );
};

export default TestSequencerView;
