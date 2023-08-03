import { useEffect, useState } from "react";
import { useFlowChartGraph } from "@hooks/useFlowChartGraph";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { useControlsState } from "@hooks/useControlsState";
import Turnstone from "turnstone";
import { SearchIcon } from "lucide-react";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;

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
  input:
    "w-half h-10 border border-slate-300 py-2 mb-1.5 pl-10 pr-7 text-xl outline-none rounded z-3 bg-stone-700",
  inputFocus:
    "w-half h-10 border bg-stone-700 dark:bg-stone-700 border-accent1-hover py-2 mb-1.5 pl-10 pr-7 text-xl outline-none rounded z-3",
  listbox:
    "w-full bg-stone-800 sm:border sm:border-slate-300 sm:rounded text-left sm:mb-1.5 p-2 sm:drop-shadow-xl",
  item: "cursor-pointer overflow-hidden overflow-ellipsis",
  highlightedItem:
    "cursor-pointer rounded overflow-hidden bg-cyan-100 text-stone-700",
  match: "font-semibold",
  typeahead: "text-crystal-500",
  groupHeading: "cursor-default px-1.5 uppercase text-purple-300",
};

export const AppGallerySearch = ({ items }) => {
  const [focus, setFocus] = useState(false);
  const onBlur = () => setFocus(false);
  const onFocus = () => setFocus(true);

  const { loadFlowExportObject } = useFlowChartGraph();
  const { ctrlsManifest, setCtrlsManifest } = useControlsState();
  const { setIsGalleryOpen } = useFlowChartState();
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
  const fetchData = async () => {
    console.log("the items are:");
    console.log(items);
    const test = await Promise.all(
      items.map(async (item) => {
        const response = await fetch(item.url);
        const raw = await response.json();
        const nodeArray = raw.map((node) => {
          return {
            name: node.name,
            url: node.url,
          };
        });
        return {
          name: item.name,
          displayField: "name",
          data: nodeArray,
          id: item.name.toLowerCase(),
          ratio: 4,
          searchType: "startswith",
        };
      })
    );
    setTestBox(test);
  };

  const displayIconStyle = focus
    ? "text-stone-300"
    : "incline-flex text-stone-500";

  useEffect(() => {
    fetchData().catch(error);
  }, [items]);

  return (
    <div className="relative top-1">
      <span className="absolute left-2 top-2 z-10 w-6 items-center justify-center">
        <SearchIcon className={displayIconStyle} />
      </span>
      <Turnstone
        id="node search"
        placeholder="Search node name"
        noItemsMessage="No Node Found"
        listbox={testbox}
        listboxIsImmutable={false}
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
