import { useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";

type SettingsGroup = "frontend" | "backend";

type SettingsType = "number" | "switch";

type ValueType = number | boolean;

export type Setting = {
  title: string;
  key: string;
  group: SettingsGroup;
  desc: string;
  type: SettingsType;
  value: ValueType;
};

const settingsListDefault = atomWithImmer<Setting[]>([
  {
    title: "Node Delay",
    key: "nodeDelay",
    group: "backend",
    type: "number",
    desc: "Delay before running the next node in seconds",
    value: 0,
  },
  {
    title: "Maximum Runtime",
    key: "maximumRuntime",
    group: "backend",
    type: "number",
    desc: "Time before the program cancels automatically in seconds",
    value: 3000,
  },
  {
    title: "Precompilation mode",
    key: "precompile",
    type: "switch",
    group: "backend",
    desc: "Precompile the program before running it",
    value: false,
  },
]);

export const useSettings = () => {
  const [settings, setSettings] = useAtom(settingsListDefault);

  const updateSettings = (key: string, value: ValueType) => {
    setSettings((prev) => {
      const setting = prev.find((s) => s.key === key);
      if (setting) {
        setting.value = value;
      }
    });
  };

  return {
    settings,
    updateSettings,
  };
};
