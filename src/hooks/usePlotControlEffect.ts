import { PlotTypesManifest } from "@src/feature/controls_panel/manifest/CONTROLS_MANIFEST";
import { NodeInputOptions } from "@src/feature/controls_panel/types/ControlOptions";
import { PlotControlStateType } from "@src/feature/controls_panel/views/PlotControlState";
import { useCallback, useEffect } from "react";
import { v4 as uuid4 } from "uuid";

const usePlotControlEffect = ({
  selectedKeys,
  setInputOptions,
  setPlotOptions,
  setSelectedKeys,
  nd,
  ctrlObj,
  results,
  selectedOption,
  selectedPlotOption,
  setNd,
  setPlotData,
  inputOptions,
}: PlotControlStateType) => {
  /**
   * Updates input options from available inputs in a node
   */
  const updateInputOptions = useCallback(() => {
    const inputOptions: NodeInputOptions[] = [];
    if (typeof nd!?.result["x"] === "object") {
      if (Array.isArray(nd?.result["x"])) {
        const consistArray = nd?.result.x.find((e) => Array.isArray(e));
        if (consistArray) {
          for (const [key, value] of Object.entries(nd!?.result["x"]!)) {
            inputOptions.push({ label: key, value: value });
          }
        } else {
          inputOptions.push({
            label: "x",
            value: nd!.result["x"]!,
          });
        }
      } else {
        for (const [key, value] of Object.entries(nd!?.result["x"]! || {})) {
          inputOptions.push({ label: key, value: value });
        }
      }
    } else {
      inputOptions.push({ label: "x", value: nd!.result["x"]! });
    }

    inputOptions.push({ label: "y", value: nd!.result["y"]! });
    setInputOptions(inputOptions);
  }, [nd, setInputOptions]);
  /**
   * Updates plot value from node result using selected keys
   */
  const updatePlotValue = useCallback(() => {
    const result: any = {};

    if (nd?.result && "data" in nd!.result) {
      result.x = nd?.result?.data![0]?.x;
      result.y = nd?.result?.data![0]?.y;
      result.type = nd?.result?.data![0]?.type;
      result.mode = nd?.result?.data![0]?.mode;
    }

    if (selectedKeys) {
      for (const [key, value] of Object.entries(selectedKeys)) {
        if (key !== "type") {
          result[key] = value?.value;
        }
      }
    }
    if (selectedPlotOption) {
      result.type = selectedPlotOption.value.type;
      result.mode = selectedPlotOption.value.mode;
    }

    setPlotData([result]);
  }, [nd, selectedKeys, selectedPlotOption, setPlotData]);

  // update input options automatically when result is changed
  useEffect(() => {
    if (nd?.result) {
      updateInputOptions();
    }
  }, [nd?.result, updateInputOptions]);

  // update selected keys of nodes for plot when input options updated
  useEffect(() => {
    setSelectedKeys((prev) => {
      const updatedKeys = {};
      if (prev) {
        for (const [key, value] of Object.entries(prev!)) {
          updatedKeys[key] = inputOptions.find(
            (opt) => opt.label === value?.label
          );
        }
      }
      return updatedKeys;
    });
  }, [inputOptions, setSelectedKeys]);

  // update plot values when selected keys are updated
  useEffect(() => {
    updatePlotValue();
  }, [selectedKeys, updatePlotValue]);

  // Initialize plot type options on component did mount
  useEffect(() => {
    PlotTypesManifest.forEach((item) => {
      setPlotOptions((prev) => [
        ...prev,
        {
          label: item.name,
          value: {
            id: `plot_${uuid4()}`,
            type: item.type,
            mode: item.mode,
          },
        },
      ]);
    });
    return () => {
      setPlotOptions([]);
    };
  }, [setPlotOptions]);

  // Cleanup selected keys when ctrlobj parameter is updated
  useEffect(() => {
    return () => {
      setSelectedKeys(null);
    };
  }, [ctrlObj.param, setSelectedKeys]);
};

export default usePlotControlEffect;
