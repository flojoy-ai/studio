import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import TestSequencerInfo from "@/renderer/routes/test_sequencer_panel/components/TestSequencerInfo";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  LAYOUT_TOP_HEIGHT,
  BOTTOM_STATUS_BAR_HEIGHT,
  ACTIONS_HEIGHT,
} from "@/renderer/routes/common/Layout";

const TestSequencerView = () => {
  const { isLoading } = useTestSequencerState();
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="px-12">
        {!isLoading && <TestSequencerInfo />}
        {isLoading &&
          <div
            style={{height: `calc(100vh - ${LAYOUT_TOP_HEIGHT + BOTTOM_STATUS_BAR_HEIGHT + ACTIONS_HEIGHT}px)`}}
            className="flex justify-center items-center"
          >
            <h1 className="font-bold text-gray-500">Loading...</h1>
          </div>
        }
    </div>
    </DndProvider>
  );
};
export default TestSequencerView;
