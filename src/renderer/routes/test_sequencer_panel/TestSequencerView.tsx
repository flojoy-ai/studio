import TestSequencerInfo from "@/renderer/routes/test_sequencer_panel/components/TestSequencerInfo";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  LAYOUT_TOP_HEIGHT,
  BOTTOM_STATUS_BAR_HEIGHT,
  ACTIONS_HEIGHT,
} from "@/renderer/routes/common/Layout";
import { useSequencerStore } from "@/renderer/stores/sequencer";
import { useShallow } from "zustand/react/shallow";

const TestSequencerView = () => {
  const isLoading = useSequencerStore(useShallow((state) => state.isLoading));
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="px-8">
        {!isLoading && <TestSequencerInfo />}
        {isLoading && (
          <div
            style={{
              height: `calc(100vh - ${LAYOUT_TOP_HEIGHT + BOTTOM_STATUS_BAR_HEIGHT + ACTIONS_HEIGHT}px)`,
            }}
            className="flex items-center justify-center"
          >
            <h1 className="font-bold text-gray-500">Loading...</h1>
          </div>
        )}
      </div>
    </DndProvider>
  );
};
export default TestSequencerView;
