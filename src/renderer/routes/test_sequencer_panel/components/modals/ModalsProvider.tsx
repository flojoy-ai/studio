import { ErrorModal } from "./ErrorModal";
import { ImportTestModal } from "./ImportTestModal";
import { RenameTestModal } from "./RenameTestModal";
import { TestSequencerProjectModal } from "./TestSequencerProjectModal";

export function ModalsProvider() {
  return (
    <div>
      <TestSequencerProjectModal />
      <ImportTestModal />
      <ErrorModal />
      <RenameTestModal />
    </div>
  );
}
