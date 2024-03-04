import { DataTable } from "./data_table/DataTable";
import { SummaryTable } from "./SummaryTable";
import { LockedContextProvider } from "@/renderer/context/lock.context";
import {
  LAYOUT_TOP_HEIGHT,
  BOTTOM_STATUS_BAR_HEIGHT,
} from "@/renderer/routes/common/Layout";
import { TabsDemo } from "./Panels";

const TestSequencerView = () => {
  return (
    <LockedContextProvider>
      <div
        style={{
          height: `calc(100vh - ${LAYOUT_TOP_HEIGHT + BOTTOM_STATUS_BAR_HEIGHT}px)`,
        }}
      >
        <div className="flex overflow-y-auto">
          <div
            className="ml-auto mr-auto h-3/5 flex-grow flex-col overflow-y-auto"
            style={{ height: "calc(100vh - 260px)" }}
          >
            <SummaryTable />
            <DataTable />
          </div>

          <div>
            <div className="top-0 h-full flex-none overflow-y-auto pl-5">
              <TabsDemo />
            </div>
          </div>
        </div>
      </div>
    </LockedContextProvider>
  );
};

export default TestSequencerView;
