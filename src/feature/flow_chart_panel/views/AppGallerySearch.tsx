import { useEffect, useState } from "react";
import { ElementsData } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { ReactFlowJsonObject } from "reactflow";
import { useFlowChartGraph } from "@hooks/useFlowChartGraph";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { useControlsState } from "@hooks/useControlsState";
import Turnstone from "turnstone";
import { SearchIcon } from "lucide-react";

interface SearchProps {
  items: listBox[];
}
export interface listBox {
  name: string;
  displayField: string;
  data: object[];
  id: string;
  ratio: number;
  searchType?: "startswith" | "contains";
}
interface nodeName {
  name: string;
  type: string;
  parent: string;
}

// const listbox: listBox[] = [
//   {
//     name: "AI/ML",
//     displayField: "name",
//     data: [
//       {
//         name: "ACCURACY",
//         type: "CLASSIFICATION",
//         parent: "AI/ML",
//       },
//       {
//         name: "LEAST_SQUARES",
//         type: "REGRESSION",
//         parent: "AL/ML",
//       },
//     ],
//     id: "AI",
//     ratio: 1,
//     searchType: "startswith",
//   },
//   {
//     name: "TRANSFORMERS",
//     displayField: "name",
//     data: [
//       {
//         name: "FFT",
//         type: "SIGNAL_PROCESSING",
//         parent: "TRANSFORMERS",
//       },
//       {
//         name: "ADD",
//         type: "ARITHMETIC",
//         parent: "TRANSFORMERS",
//       },
//     ],
//     id: "TRANSFORMERS",
//     ratio: 1,
//     searchType: "startswith",
//   },
// ];

const style = {
  //input: "w-full border rounded border-gray-500 bg-gray-800 px-7 py-3 pl-10 outline-none",
  input:
    "w-half h-10 border bg-stone-800 border-slate-300 py-2 pl-10 pr-7 text-xl outline-none rounded z-3",
  inputFocus:
    "w-half h-10 border bg-stone-800 dark:bg-stone-800 border-accent1-hover py-2 pl-10 pr-7 text-xl outline-none rounded z-3",
  listbox:
    "w-full bg-stone-800 sm:border sm:border-slate-300 sm:rounded text-left sm:mt-2 p-2 sm:drop-shadow-xl",
  item: "cursor-pointer overflow-hidden overflow-ellipsis",
  highlightedItem:
    "cursor-pointer rounded overflow-hidden bg-cyan-100 text-stone-700",
  match: "font-semibold",
  typeahead: "text-crystal-500",
  groupHeading: "cursor-default px-1.5 uppercase text-purple-300",
};

export const AppGallerySearch = (items) => {
  const [focus, setFocus] = useState(false);
  const onBlur = () => setFocus(false);
  const onFocus = () => setFocus(true);

  const { loadFlowExportObject } = useFlowChartGraph();
  const { setIsGalleryOpen } = useFlowChartState();
  const { ctrlsManifest, setCtrlsManifest } = useControlsState();
  const [testbox, setTestBox] = useState<listBox[]>([]);

  const handleSelect = async (selectItem: nodeName) => {
    // const response = await fetch(
    //   `https://raw.githubusercontent.com/flojoy-ai/docs/main/docs/nodes/${selectItem.parent}/${selectItem.type}/${selectItem.name}/examples/EX1/app.txt`
    // );
    // const raw = await response.json();
    // const flow = raw.rfInstance as ReactFlowJsonObject<ElementsData, any>;
    // setCtrlsManifest(raw.ctrlsManifest || ctrlsManifest);
    // loadFlowExportObject(flow);
    if (selectItem) setIsGalleryOpen(false);
  };

  const displayIconStyle = focus
    ? "text-accent1-hover"
    : "incline-flex text-stone-500";

  useEffect(() => {
    const test: listBox[] = [
      {
        name: "nodes",
        displayField: "name",
        data: items,
        id: "node",
        ratio: 8,
        searchType: "startswith",
      },
    ];
    setTestBox(test);
    console.log(test);
  }, [items]);

  return (
    <div className="relative right-12 top-1">
      <span className="absolute left-2 top-2 z-10 w-6 items-center justify-center">
        <SearchIcon className={displayIconStyle} />
      </span>
      <Turnstone
        id="node search"
        placeholder="Search node name"
        noItemsMessage="No Node Found"
        listbox={testbox}
        styles={style}
        onEnter={handleSelect}
        onSelect={handleSelect}
        onBlur={onBlur}
        onFocus={onFocus}
        matchText={true}
      />
    </div>
  );
};
