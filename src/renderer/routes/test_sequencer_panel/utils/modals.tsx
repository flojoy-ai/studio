import { TestSequencerProjectModal } from "@/renderer/routes/test_Sequencer_panel/components/TestSequencerProjectModal";
import { ImportTestModal } from "@/renderer/routes/test_Sequencer_panel/components/ImportTestModal";


export const createModalProvider = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const handleClickImportTest = () => {
    setIsImportModalOpen(true);
  };

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  return (
    <div>
        <TestSequencerProjectModal
          isProjectModalOpen={isProjectModalOpen}
          handleProjectModalOpen={setIsProjectModalOpen}
        />
        <ImportTestModal
          isModalOpen={isImportModalOpen}
          handleModalOpen={setIsImportModalOpen}
        />
    </div>

  )
};
