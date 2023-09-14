import { useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import localforage from "localforage";
import { useEffect } from "react";

const store = localforage.createInstance({
  name: "flojoy-settings",
});

type SettingsGroup = "frontend" | "backend" | "micropython";

type SettingsType = "number" | "string" | "switch";

type ValueType = number | string | boolean;

export type Setting = {
  title: string;
  key: string;
  group: SettingsGroup;
  desc: string;
  type: SettingsType;
  value: ValueType;
};

const settingsAtom = atomWithImmer<Setting[]>([

  /* BACKEND SETTINGS */
  {
    title: "Node Delay",
    key: "nodeDelay",
    group: "backend",
    type: "number",
    desc: "Delay before running the next node in milliseconds",
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

  /* MICROPYTHON SETTINGS */
  {
    title: "Selected Port",
    key: "selectedPort",
    group: "micropython",
    type: "string",
    desc: "The port that is selected for uploading",
    value: "",
  }
]);

export const useSettings = (group: SettingsGroup) => {
  const [settings, setSettings] = useAtom(settingsAtom);

  const updateSettings = (key: string, value: ValueType) => {
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
