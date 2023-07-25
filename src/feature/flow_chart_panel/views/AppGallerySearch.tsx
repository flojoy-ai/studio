import { useState } from "react";
import { ElementsData } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { ReactFlowJsonObject } from "reactflow";
import { useFlowChartGraph } from "@hooks/useFlowChartGraph";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { useControlsState } from "@hooks/useControlsState";
import Turnstone from "turnstone";

const linkTest =
  "https://raw.githubusercontent.com/flojoy-io/docs/main/docs/nodes/AI_ML/CLASSIFICATION/ACCURACY/examples/EX1/app.txt";

const listbox = {
  name: "Popular Cities",
  displayField: "name",
  data: [
    { name: "Paris, France", coords: "48.86425, 2.29416" },
    { name: "Rome, Italy", coords: "41.89205, 12.49209" },
    { name: "Orlando, Florida, United States", coords: "28.53781, -81.38592" },
    { name: "London, England", coords: "51.50420, -0.12426" },
    { name: "Barcelona, Spain", coords: "41.40629, 2.17555" },
    {
      name: "New Orleans, Louisiana, United States",
      coords: "29.95465,-90.07507",
    },
    { name: "Chicago, Illinois, United States", coords: "41.85003,-87.65005" },
    { name: "Manchester, England", coords: "53.48095,-2.23743" },
  ],
  id: "popular",
  ratio: 1,
};

const style = {
  //input: "w-full border rounded border-gray-500 bg-gray-800 px-7 py-3 pl-10 outline-none",
  input:
    "w-full h-12 border bg-stone-800 border-slate-300 py-2 pl-10 pr-7 text-xl outline-none rounded",
  listbox:
    "w-full bg-stone-800 sm:border sm:border-slate-300 sm:rounded text-left sm:mt-2 p-2 sm:drop-shadow-xl",
  item: "cursor-pointer overflow-hidden overflow-ellipsis",
  highlightedItem:
    "cursor-pointer rounded overflow-hidden bg-cyan-100 text-stone-700",
};

export const AppGallerySearch = () => {
  const [input, setInput] = useState("");
  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const { loadFlowExportObject } = useFlowChartGraph();
  const { setIsGalleryOpen } = useFlowChartState();
  const { ctrlsManifest, setCtrlsManifest } = useControlsState();

  const handleKeyDown = async () => {
    const response = await fetch(linkTest);
    const raw = await response.json();
    const flow = raw.rfInstance as ReactFlowJsonObject<ElementsData, any>;
    setCtrlsManifest(raw.ctrlsManifest || ctrlsManifest);
    loadFlowExportObject(flow);
    setIsGalleryOpen(false);
  };

  return (
    <div className="relative top-2">
      {/*<svg*/}
      {/*  className="absolute left-2 top-3 w-6 text-white"*/}
      {/*  fill="none"*/}
      {/*  stroke="currentColor"*/}
      {/*  viewBox="0 0 24 24"*/}
      {/*  xmlns="http://www.w3.org/2000/svg"*/}
      {/*>*/}
      {/*  <path*/}
      {/*    stroke-linecap="round"*/}
      {/*    stroke-linejoin="round"*/}
      {/*    stroke-width="2"*/}
      {/*    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"*/}
      {/*  ></path>*/}
      {/*</svg>*/}
      <Turnstone
        placeholder="Search node name"
        noItems="No node found"
        listbox={listbox}
        styles={style}
        onEnter={handleKeyDown}
        matchText={true}
      />
    </div>
  );
};
