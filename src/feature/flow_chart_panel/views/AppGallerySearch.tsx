import { useEffect, useState } from "react";
import { useFlowChartGraph } from "@hooks/useFlowChartGraph";
import { useControlsState } from "@hooks/useControlsState";
import Turnstone from "turnstone";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;
import { ReactFlowJsonObject } from "reactflow";
import { ElementsData } from "flojoy/types";
import { GithubJSON } from "@feature/flow_chart_panel/views/AppGalleryModal";
import { startup } from "vite-plugin-electron";
import exit = startup.exit;

export interface ListBox {
  name: string;
  displayField: string;
  data: turnStoneData[];
  id: string;
  ratio: number;
  searchType?: "startswith" | "contains";
}

interface SearchProps {
  items: GithubJSON[];
  setIsGalleryOpen: (open: boolean) => void;
  turnStoneRef: React.MutableRefObject<undefined>;
}

interface turnStoneData {
  name: string;
  url: string;
}

const style = {
  input:
    "h-10 w-full rounded-md font-medium border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  inputFocus:
    "h-10 w-full font-medium rounded-md border border-accent1-hover bg-background px-3 py-2 text-sm ring-offset-background file:bg-transparent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ",
  listbox:
    "relative w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
  item: "w-full cursor-default items-center rounded-sm py-1.5 pl-8 text-base font-normal outline-none",
  highlightedItem:
    "w-full cursor-default items-center rounded-sm py-1.5 pl-8 font-medium text-base outline-none bg-accent",
  match: "font-bold",
  typeahead: "text-crystal-500 font-light",
  groupHeading: "cursor-default px-1.5 uppercase text-sm text-accent1-hover",
  noItems: "cursor-default text-center my-10 text-sm font-medium",
};

export const AppGallerySearch = ({
  items,
  setIsGalleryOpen,
  turnStoneRef,
}: SearchProps) => {
  const { loadFlowExportObject } = useFlowChartGraph();
  const { ctrlsManifest, setCtrlsManifest } = useControlsState();
  const [listBoxes, setListBoxes] = useState<ListBox[]>([]);

  const handleSelect = async (selectItem: GithubJSON) => {
    if (selectItem) {
      const firstResponse = await fetch(selectItem.url);
      const file = await firstResponse.json();

      const textFile: GithubJSON = file.find(
        (obj: GithubJSON) => obj.name === "app.txt"
      );

      const secondResponse = await fetch(textFile.download_url ?? "");
      const raw = await secondResponse.json();

      const flow = raw.rfInstance as ReactFlowJsonObject<ElementsData, any>;
      setCtrlsManifest(raw.ctrlsManifest || ctrlsManifest);
      loadFlowExportObject(flow);
      setIsGalleryOpen(false);
    }
  };

  const fetchData = async () => {
    const data: ListBox[] = await Promise.all(
      items.map(async (item) => {
        const response = await fetch(item.url);
        const raw = await response.json();
        console.log("the raw is: ");
        console.log(raw);
        const nodeArray: turnStoneData[] = raw.map((node) => {
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
          ratio: 1,
          searchType: "startswith",
        };
      })
    );
    setListBoxes(data);
  };

  useEffect(() => {
    fetchData().catch(error);
  }, [items]);

  return (
    <div className="relative top-1 w-full">
      <Turnstone
        ref={turnStoneRef}
        id="node search"
        placeholder="Search node name"
        noItemsMessage="No Node Found"
        enterKeyHint="enter"
        listbox={listBoxes}
        listboxIsImmutable={false}
        styles={style}
        onSelect={handleSelect}
        matchText={true}
        maxItems={10}
      />
    </div>
  );
};
