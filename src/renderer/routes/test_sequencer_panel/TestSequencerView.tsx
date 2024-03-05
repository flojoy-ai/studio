import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import TestSequencerInfo from "@/renderer/routes/test_sequencer_panel/components/TestSequencerInfo";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const TestSequencerView = () => {
  const { isLoading } = useTestSequencerState();
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-12">
        {!isLoading && <TestSequencerInfo />}
        {isLoading && <h1 className="font-bold text-gray-500">Loading...</h1>}
      </div>
    </DndProvider>
  );
};
export default TestSequencerView;
