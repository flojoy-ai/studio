import { atom, useAtom } from "jotai";
import { useEffect } from "react";

export type Settings = {
  title: string;
  key: string;
  type: string;
  group: string;
  value: any;
};

const settingsListDefault = atom([
  {
    title: "Node Delay (seconds)",
    key: "nodeDelay",
    type: "numerical-input",
    group: "backend",
    value: 0.1,
  },
  {
    title: "Maximum Runtime (seconds)",
    key: "maximumRuntime",
    type: "numerical-input",
    group: "backend",
    value: 3000,
  },
]);

export const useSettings = () => {
  const [settingsList, setSettingsList] = useAtom(settingsListDefault);

  const updateSettingList = (key: string, value: number) => {
    setSettingsList((prev) => {
      return prev.map((setting) => {
        if (setting.key === key) {
          return { ...setting, value };
        }
        return setting;
      });
    });
  };

  return {
    settingsList,
    updateSettingList,
  };
};
