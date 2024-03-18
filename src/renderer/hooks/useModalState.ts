import { useModalStore } from "@/renderer/stores/modal";
import { useShallow } from "zustand/react/shallow";

export function useModalState() {
  const state: {
    isImportTestModalOpen;
    isCreateProjectModalOpen;
    isRenameTestModalOpen;
    renameTestId;
    setIsImportTestModalOpen;
    setIsCreateProjectModalOpen;
    setIsRenameTestModalOpen;
  } = useModalStore(
    useShallow((state) => {
      return {
        isImportTestModalOpen: state.isImportTestModalOpen,
        isCreateProjectModalOpen: state.isCreateProjectModalOpen,
        isRenameTestModalOpen: state.isRenameTestModalOpen,
        renameTestId: state.renameTestId,
        setIsImportTestModalOpen: state.setIsImportTestModalOpen,
        setIsCreateProjectModalOpen: state.setIsCreateProjectModalOpen,
        setIsRenameTestModalOpen: state.setIsRenameTestModalOpen,
      };
    }),
  );
  return state;
}
