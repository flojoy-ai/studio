import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import TestSequencerInfo from "./components/TestSequencerInfo";

const TestSequencerView = () => {
  const { isLoading } = useTestSequencerState();
  return (
    <div className="p-12">
      {!isLoading && <TestSequencerInfo />}
      {isLoading && <h1 className="font-bold text-gray-500">Loading...</h1>}
    </div>
  );
};
export default TestSequencerView;
