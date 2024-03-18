import { useModalStore } from "@/renderer/stores/modal";
import { TestSequencerProjectModal } from "../components/TestSequencerProjectModal";
import { ImportTestModal } from "../components/ImportTestModal";


export function ModalProvider() {
  const { isImportTestModalOpen, setIsImportTestModalOpen, isCreateProjectModalOpen, setIsCreateProjectModalOpen } = useModalStore();
  
  return (
    <div>
        <TestSequencerProjectModal/>
        <ImportTestModal
          isModalOpen={isImportTestModalOpen}
          handleModalOpen={setIsImportTestModalOpen}
        />
    </div>
  )
};
