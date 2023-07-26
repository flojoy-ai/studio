import { atom, useAtom } from "jotai";

type allowedValueTypes = string | number | boolean;

export type Settings = {
  title: string;
  key: string;
  type: string;
  group: string;
  value: allowedValueTypes;
};

const settingsListDefault = atom([
  {
    title: "Node Delay (seconds)",
    key: "nodeDelay",
    type: "number",
    group: "backend",
    value: 0,
  },
  {
    title: "Maximum Runtime (seconds)",
    key: "maximumRuntime",
    type: "number",
    group: "backend",
    value: 3000,
  },
  {
    title: "Precompilation mode",
    key: "precompile",
    type: "switch",
    group: "backend",
    value: false,
  },
]);

export const useSettings = () => {
  const [settingsList, setSettingsList] = useAtom(settingsListDefault);

  const updateSettingList = (key: string, value: allowedValueTypes) => {
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
