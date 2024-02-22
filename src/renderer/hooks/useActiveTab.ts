import { useState } from "react";
import { atom, useAtom } from "jotai";

export const TabEnum = {
  SEQUENCER: "Test Sequencer",
  FLOWCHART: "Visual Python Script",
  DEVICES: "Hardware Devices",
};

export const tabAtom = atom<TabEnum>(TabEnum.SEQUENCER);

export function useActiveTab() {
  const [activeTab, setActiveTab] = useAtom(tabAtom);
  return {
    activeTab,
    setActiveTab,
  };
}
