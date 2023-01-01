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
  inputOptions,
}: PlotControlStateType) => {
  /**
   * Updates input options from available inputs in a node
   */
  const updateInputOptions = () => {
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
  };
  /**
   * Updates plot value from node result using selected keys
   */
  const updatePlotValue = () => {
    const result: any = {};

    console.log("node data: ",nd);
    console.log("selected keys: ",selectedKeys)

    if (nd?.result && "data" in nd!.result) {

      console.log("SETTING RESULT DATA")

      result.x = nd?.result?.data![0]?.x;
      result.y = nd?.result?.data![0]?.y;
      result.type = nd?.result?.data![0]?.type;
      result.mode = nd?.result?.data![0]?.mode;
    }

    console.log("PLOT DATA RESULT: ",result)

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

    console.log("PLOT DATA RESULT: ",result)

    setPlotData([result]);
  };

  // update input options automatically when result is changed
  useEffect(() => {
    if (nd?.result) {
      updateInputOptions();
    }
  }, [nd?.result]);

  // update selected keys of nodes for plot when input options updated
  useEffect(() => {
    setSelectedKeys((prev) => {
      const updatedKeys = {};
      if (prev) {
        for (const [key, value] of Object.entries(prev!)) {
          updatedKeys[key] = inputOptions.find(
            (opt) => opt.label === value.label
          );
        }
      }
      return updatedKeys;
    });
  }, [inputOptions]);

  // update plot values when selected keys are updated
  useEffect(() => {
    updatePlotValue();
  }, [selectedKeys]);

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
  }, []);

  // Filter attached node result from all node results
  useEffect(() => {
    try {
      // figure out what we're visualizing
      const nodeIdToPlot = ctrlObj?.param;
      console.log("Result HERE: ",results);
      if (nodeIdToPlot) {
        if (results && "io" in results) {
          const runResults = results.io!.reverse();
          const filteredResult = runResults.filter(
            (node) => nodeIdToPlot === node.id
          )[0];
          setNd(filteredResult === undefined ? null : filteredResult);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [ctrlObj.param, results.io, selectedOption, selectedPlotOption]);

  // Cleanup selected keys when ctrlobj parameter is updated
  useEffect(() => {
    return () => {
      setSelectedKeys(null);
    };
  }, [ctrlObj.param]);
};

export default usePlotControlEffect;
