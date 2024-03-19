import { DataTable } from "./data-table/DataTable";
import { SummaryTable } from "./SummaryTable";
import { CloudPanel } from "./CloudPanel";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import LockableButton from "./lockable/LockedButtons";
import { LockedContextProvider } from "@/renderer/context/lock.context";
import _ from "lodash";
import {
  LAYOUT_TOP_HEIGHT,
  BOTTOM_STATUS_BAR_HEIGHT,
} from "@/renderer/routes/common/Layout";
import { ModalsProvider } from "./modals/ModalsProvider";
import { ControlPanel } from "./ControlPanel";

const TestSequencerView = () => {
  const { setElems, tree, setIsLocked, backendState } =
    useTestSequencerState();



  return (
    <LockedContextProvider>
      <div
        style={{
          height: `calc(100vh - ${LAYOUT_TOP_HEIGHT + BOTTOM_STATUS_BAR_HEIGHT}px)`,
        }}
      >
        <ModalsProvider />
        <div className="flex overflow-y-auto">
          <div
            className="ml-auto mr-auto h-3/5 flex-grow flex-col overflow-y-auto"
            style={{ height: "calc(100vh - 260px)" }}
          >
            <div className="flex">
              <div className="rounded-xl mr-5 border border-gray-300 p-4 py-4 dark:border-gray-800 w-500 h-102">
                Control Panel 
              </div>
              <ControlPanel />
              <SummaryTable />
            </div>

            <DataTable />
          </div>

          <div>
            <div className="top-0 h-full flex-none overflow-y-auto pl-5">
              <CloudPanel />
              <ControlPanel />
            </div>
          </div>
        </div>
      </div>
    </LockedContextProvider>
  );
};

export default TestSequencerView;
