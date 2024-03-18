import { useModalStore } from "@/renderer/stores/modal";
import { useShallow } from "zustand/react/shallow";

export function useModalState() {
  const state: {
    isImportTestModalOpen;
    isCreateProjectModalOpen;
    isRenameTestModalOpen;
    isErrorModalOpen;
    renameTestId;
    errorModalMessage;
    setIsImportTestModalOpen;
    setIsCreateProjectModalOpen;
    setIsRenameTestModalOpen;
    setIsErrorModalOpen;
    openRenameTestModal;
    openErrorModal;
  } = useModalStore(
    useShallow((state) => {
      return {
        isImportTestModalOpen: state.isImportTestModalOpen,
        isCreateProjectModalOpen: state.isCreateProjectModalOpen,
        isRenameTestModalOpen: state.isRenameTestModalOpen,
        isErrorModalOpen: state.isErrorModalOpen,
        renameTestId: state.renameTestId,
        errorModalMessage: state.errorModalMessage,
        setIsImportTestModalOpen: state.setIsImportTestModalOpen,
        setIsCreateProjectModalOpen: state.setIsCreateProjectModalOpen,
        setIsRenameTestModalOpen: state.setIsRenameTestModalOpen,
        setIsErrorModalOpen: state.setIsErrorModalOpen,
        openRenameTestModal: state.openRenameTestModal,
        openErrorModal: state.openErrorModal,
      };
    }),
  );
  return state;
}
