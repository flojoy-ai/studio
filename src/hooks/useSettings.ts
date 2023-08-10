import { useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";

type SettingsGroup = "frontend" | "backend";

export type Setting = {
  title: string;
  key: string;
  group: SettingsGroup;
  desc: string;
  value: number;
};

const settingsListDefault = atomWithImmer<Setting[]>([
  {
    title: "Node Delay",
    key: "nodeDelay",
    group: "backend",
    desc: "Delay before running the next node in seconds",
    value: 0,
  },
  {
    title: "Maximum Runtime",
    key: "maximumRuntime",
    group: "backend",
    desc: "Time before the program cancels automatically in seconds",
    value: 3000,
  },
]);

export const useSettings = () => {
  const [settings, setSettings] = useAtom(settingsListDefault);

  const updateSettings = (key: string, value: number) => {
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
