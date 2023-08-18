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

const settingsAtom = atomWithImmer<Setting[]>([
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
]);

export const useSettings = (group: "frontend" | "backend") => {
  const [settings, setSettings] = useAtom(settingsAtom);

  const updateSettings = (key: string, value: ValueType) => {
    setSettings((prev) => {
      const setting = prev.find((s) => s.key === key);
      if (setting) {
        setting.value = value;
      }
    });
  };

  return {
    settings: settings.filter((s) => s.group === group),
    updateSettings,
  };
};
