import { useEffect, useState, useRef } from "react";
import { useFlowChartGraph } from "@hooks/useFlowChartGraph";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { useControlsState } from "@hooks/useControlsState";
import Turnstone from "turnstone";
import { SearchIcon } from "lucide-react";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;
import { ReactFlowJsonObject } from "reactflow";
import { ElementsData } from "flojoy/types";

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

const style = {
  input:
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm outline-none file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  inputFocus:
    "flex h-10 w-full rounded-md border border-input bg-accent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 border-accent1-hover",
  listbox:
    "relative w-full z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
  item: "w-full cursor-default items-center rounded-sm py-1.5 pl-8 text-base font-normal outline-none",
  highlightedItem:
    "w-full cursor-default items-center rounded-sm py-1.5 pl-8 font-medium text-base outline-none bg-accent",
  match: "font-semibold",
  typeahead: "text-crystal-500 font-light",
  groupHeading: "cursor-default px-1.5 uppercase text-sm text-purple-300",
};

export const AppGallerySearch = ({ items, setIsGalleryOpen }) => {
  const [focus, setFocus] = useState(false);
  const onBlur = () => setFocus(false);
  const onFocus = () => setFocus(true);

  const { loadFlowExportObject } = useFlowChartGraph();
  const { ctrlsManifest, setCtrlsManifest } = useControlsState();
  const [listBoxes, setListBoxes] = useState<listBox[]>([]);
  const turnstoneRef = useRef();

  const handleSelect = async (selectItem) => {
    if (selectItem) {
      console.log(`the selected is: ${selectItem.name}`);
      const response = await fetch(selectItem.url);
      const file = await response.json();
      console.log("the file is: ");
      console.log(file);
      const text = file.find((obj) => obj.name === "app.txt");
      console.log(`the url is: ${text.download_url}`);
      const load = await fetch(text.download_url);
      const raw = await load.json();
      const flow = raw.rfInstance as ReactFlowJsonObject<ElementsData, any>;
      setCtrlsManifest(raw.ctrlsManifest || ctrlsManifest);
      loadFlowExportObject(flow);
      setIsGalleryOpen(false);
    }
  };

  // const handleTab = (query, selectItem) => {
  //   console.log(`the item is: ${selectItem.name}`);
  //   if (selectItem) {
  //     turnstoneRef.current?.query("testing");
  //   }
  // };
  const fetchData = async () => {
    const data: listBox[] = await Promise.all(
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
    setListBoxes(data);
  };

  const displayIconStyle = focus
    ? "text-stone-300"
    : "incline-flex text-stone-500";

  useEffect(() => {
    fetchData().catch(error);
  }, [items]);

  return (
    <div className="relative top-1">
      {/*<span className="absolute left-2 top-2 z-10 w-6 items-center justify-center">*/}
      {/*  <SearchIcon className={displayIconStyle} />*/}
      {/*</span>*/}
      <Turnstone
        ref={turnstoneRef}
        id="node search"
        placeholder="Search node name"
        noItemsMessage="No Node Found"
        enterKeyHint="enter"
        listbox={listBoxes}
        listboxIsImmutable={false}
        styles={style}
        onSelect={handleSelect}
        onBlur={onBlur}
        onFocus={onFocus}
        matchText={true}
      />
    </div>
  );
};
