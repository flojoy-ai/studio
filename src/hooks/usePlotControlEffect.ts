import { PlotTypesManifest } from "@src/feature/controls_panel/manifest/CONTROLS_MANIFEST";
import { NodeInputOptions } from "@src/feature/controls_panel/types/ControlOptions";
import { PlotControlStateType } from "@src/feature/controls_panel/views/PlotControlState";
import { useEffect } from "react";
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
}: PlotControlStateType) => {
  const updatePlotValue = () => {
    const inputOptions: NodeInputOptions[] = [];
    if (typeof nd!.result["x"] === "object") {
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
        for (const [key, value] of Object.entries(nd!?.result["x"]!)) {
          inputOptions.push({ label: key, value: value });
        }
      }
    } else {
      inputOptions.push({ label: "x", value: nd!.result["x"]! });
    }

    inputOptions.push({ label: "y", value: nd!.result["y"]! });
    setInputOptions(inputOptions);
    const result: any = {};
    if ("data" in nd!.result) {
      result.x = nd?.result?.data![0]?.x;
      result.y = nd?.result?.data![0]?.y;
      result.type = nd?.result?.data![0]?.type;
      result.mode = nd?.result?.data![0]?.mode;
    }
    if (selectedKeys) {
      for (const [key, value] of Object.entries(selectedKeys)) {
        if (key !== "type") {
          result[key] = value.value;
        }
      }
    }
    if (selectedPlotOption) {
      result.type = selectedPlotOption.value.type;
      result.mode = selectedPlotOption.value.mode;
    }
    setPlotData([result]);
  };

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
  }, []);
  useEffect(() => {
    try {
      // figure out what we're visualizing
      const nodeIdToPlot = ctrlObj?.param;
      if (nodeIdToPlot) {
        if (results && "io" in results) {
          const runResults = results.io!.reverse();
          const filteredResult = runResults.filter(
            (node) => nodeIdToPlot === node.id
          )[0];
          setNd(filteredResult === undefined ? null : filteredResult);
          if (nd && Object.keys(nd!).length > 0) {
            if (nd!.result) {
              updatePlotValue();
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [
    ctrlObj,
    nd?.result,
    results.io,
    selectedOption,
    selectedPlotOption,
    selectedKeys,
  ]);
  useEffect(() => {
    return () => {
      setSelectedKeys(null);
    };
  }, [ctrlObj.param]);
};

export default usePlotControlEffect;
