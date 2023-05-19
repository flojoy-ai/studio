import { atom, useAtom } from "jotai";
import { useEffect } from "react";

export type Settings = {
  title: string;
  key: string;
  type: string;
  group: string;
  value: any;
  setValue: any;
};

const nodeDelayDefault = atom(0);
const maximumRuntimeDefault = atom(3000);
const settingsListDefault = atom([{} as Settings]);

export const useSettings = () => {
  const [nodeDelay, setNodeDelay] = useAtom(nodeDelayDefault);
  const [maximumRuntime, setMaximumRuntime] = useAtom(maximumRuntimeDefault);
  const [settingsList, setSettingsList] = useAtom(settingsListDefault);
  useEffect(() => {
    console.log("here");
    setSettingsList([
      {
        title: "Node Delay",
        key: "nodeDelay",
        type: "numerical-input",
        group: "backend",
        value: nodeDelay,
        setValue: setNodeDelay,
      },
      {
        title: "Maximum Runtime",
        key: "maximumRuntime",
        type: "numerical-input",
        group: "backend",
        value: maximumRuntime,
        setValue: setMaximumRuntime,
      },
    ]);
  }, [nodeDelay, maximumRuntime]);

  return {
    nodeDelay,
    setNodeDelay,
    maximumRuntime,
    setMaximumRuntime,
    settingsList,
  };
};
