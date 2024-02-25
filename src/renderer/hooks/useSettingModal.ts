import { atom, useAtom } from "jotai";

export const depManagerModal = atom<boolean>(false);

export function useSettingModal() {
  const [isDepManagerModalOpen, setIsDepManagerModalOpen] =
    useAtom(depManagerModal);
  return {
    isDepManagerModalOpen,
    setIsDepManagerModalOpen,
  };
}
