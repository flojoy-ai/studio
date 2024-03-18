import { ErrorModal } from "./ErrorModal";
import { ImportTestModal } from "./ImportTestModal";
import { TestSequencerProjectModal } from "./TestSequencerProjectModal";

export function ModalsProvider() {
  return (
    <div>
      <TestSequencerProjectModal />
      <ImportTestModal />
      <ErrorModal />
    </div>
  );
}
