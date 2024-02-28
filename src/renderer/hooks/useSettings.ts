import { sendEventToMix } from "@/renderer/services/MixpanelServices";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
// TODO: Use electron-store instead
import localforage from "localforage";
import { useEffect } from "react";

const store = localforage.createInstance({
  name: "flojoy-settings",
});

type SettingGroup = "frontend" | "backend" | "device";
type SettingKey =
  | "nodeDelay"
  | "maximumRuntime"
  | "maximumConcurrentWorkers"
  | "fitViewOnResize"
  | "niDAQmxDeviceDiscovery"
  | "nidmmDeviceDiscovery";

export type Setting = {
  title: string;
  desc: string;
  key: SettingKey;
  group: SettingGroup;
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
    title: "Maximum Concurrent Workers",
    key: "maximumConcurrentWorkers",
    group: "backend",
    desc: "Maximum number of nodes that can be executed at the same time",
    value: 1,
  },
  {
    title: "Fit view on resize",
    key: "fitViewOnResize",
    group: "frontend",
    desc: "Center the view of the flow chart automatically when the window is resized",
    value: true,
  },
  {
    title: "Discover NI-DAQmx devices",
    key: "niDAQmxDeviceDiscovery",
    group: "device",
    desc: "Enable the discovery of NI compactDAQ devices and other devices relying on NI-DAQmx. Note that activating this option may lead to a longer loading time.",
    value: false,
  },
  {
    title: "Discover NI-DMM devices",
    key: "nidmmDeviceDiscovery",
    group: "device",
    desc: "Enable the discovery of NI DMM devices and other devices relying on NI-DMM. Note that activating this option may lead to a longer loading time.",
    value: false,
  },
]);

export const useSettings = (group: SettingGroup) => {
  const [settings, setSettings] = useAtom(settingsAtom);

  const updateSettings = (key: string, value: number | boolean) => {
    sendEventToMix("Update Settings");
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
