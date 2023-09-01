import { useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import localforage from "localforage";
import { useEffect } from "react";

const store = localforage.createInstance({
  name: "flojoy-settings",
});

type SettingsGroup = "frontend" | "backend";

export type Setting = {
  title: string;
  key: string;
  group: SettingsGroup;
  desc: string;
  value: number | boolean;
};

const settingsAtom = atomWithImmer<Setting[]>([
  {
    title: "Node Delay",
    key: "nodeDelay",
    group: "backend",
    desc: "Delay before running the next node in milliseconds",
    value: 0,
  },
  {
    title: "Maximum Runtime",
    key: "maximumRuntime",
    group: "backend",
    desc: "Time before the program cancels automatically in seconds",
    value: 3000,
  },
  {
    title: "Fit view on resize",
    key: "fitViewOnResize",
    group: "frontend",
    desc: "Center the view of the flow chart automatically when the window is resized",
    value: true,
  },
]);

export const useSettings = (group: "frontend" | "backend") => {
  const [settings, setSettings] = useAtom(settingsAtom);

  const updateSettings = (key: string, value: number | boolean) => {
    setSettings((prev) => {
      const setting = prev.find((s) => s.key === key);
      if (setting) {
        setting.value = value;
        store.setItem(key, value);
      }
    });
  };

  useEffect(() => {
    store.iterate((val, key) => {
      setSettings((prev) => {
        const setting = prev.find((s) => s.key === key);
        if (setting) {
          setting.value = val as number | boolean;
        }
      });
    });
  }, [setSettings]);

  return {
    settings: settings.filter((s) => s.group === group),
    updateSettings,
  };
};
