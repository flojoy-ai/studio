import { atom, useAtom } from "jotai";

export type TabName =
  | "Test Sequencer"
  | "Visual Python Script"
  | "Hardware Devices";

export const tabAtom = atom<TabName>("Visual Python Script");

export function useActiveTab() {
  const [activeTab, setActiveTab] = useAtom(tabAtom);
  return {
    activeTab,
    setActiveTab,
  };
}
