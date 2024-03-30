import { TestTable } from "./data-table/TestTable";
import { SequenceTable } from "./data-table/SequenceTable";
import { CloudPanel } from "./CloudPanel";
import { LockedContextProvider } from "@/renderer/context/lock.context";
import {
  LAYOUT_TOP_HEIGHT,
  BOTTOM_STATUS_BAR_HEIGHT,
  ACTIONS_HEIGHT,
} from "@/renderer/routes/common/Layout";
import { ModalsProvider } from "./modals/ModalsProvider";
import SequencerKeyboardShortcuts from "@/renderer/routes/test_sequencer_panel/SequencerKeyboardShortCuts";
import { ControlButton } from "./ControlButton";
import { DesignBar } from "./DesignBar";

const TestSequencerView = () => {
  return (
    <LockedContextProvider>
      <SequencerKeyboardShortcuts />
      <DesignBar />
      <div
        style={{
          height: `calc(100vh - ${LAYOUT_TOP_HEIGHT + BOTTOM_STATUS_BAR_HEIGHT + ACTIONS_HEIGHT}px)`,
        }}
        className="overflow-y-auto"
      >
        <ModalsProvider />
        <div className="flex">
          <div className="ml-auto mr-auto mt-7 h-3/5 flex-grow flex-col overflow-y-auto">
            <SequenceTable />
            <TestTable />
          </div>
          <div className="flex-none" style={{ width: "28%" }}>
            <ControlButton />
            <CloudPanel />
          </div>
        </div>
      </div>
    </LockedContextProvider>
  );
};

export default TestSequencerView;
