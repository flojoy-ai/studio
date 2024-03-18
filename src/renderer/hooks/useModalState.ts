import { useModalStore } from "@/renderer/stores/modal";
import { useShallow } from "zustand/react/shallow";

export function useModalState() {
  const state: {
    isImportTestModalOpen,
    isCreateProjectModalOpen,
    setIsImportTestModalOpen,
    setIsCreateProjectModalOpen,
  } = useModalStore(
    useShallow((state) => {
      return {
        isImportTestModalOpen: state.isImportTestModalOpen,
        isCreateProjectModalOpen: state.isCreateProjectModalOpen,
        setIsImportTestModalOpen: state.setIsImportTestModalOpen,
        setIsCreateProjectModalOpen: state.setIsCreateProjectModalOpen,
      };
    }),
  );
  return state;
}

