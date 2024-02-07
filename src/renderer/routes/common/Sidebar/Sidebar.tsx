import { ImportIcon, Search } from "lucide-react";

import { memo, useEffect, useRef, useState } from "react";

import { Leaf, RootNode } from "@/renderer/utils/ManifestLoader";
import SidebarNode from "./SidebarNode";
import { LAYOUT_TOP_HEIGHT } from "@/renderer/routes/common/Layout";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, XIcon } from "lucide-react";
import { Button } from "@/renderer/components/ui/button";
import { REQUEST_NODE_URL } from "@/renderer/data/constants";
import { cn } from "@/renderer/lib/utils";
import { Input } from "@/renderer/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/renderer/components/ui/tabs";
export type LeafClickHandler = (elem: Leaf) => void;

type SidebarProps = {
  isSideBarOpen: boolean;
  setSideBarStatus: React.Dispatch<React.SetStateAction<boolean>>;
  sections: RootNode | null;
  leafNodeClickHandler: LeafClickHandler;
  customContent?: JSX.Element;
  customSections: RootNode | null;
  handleImportCustomBlocks: (startup: boolean) => void;
};

const Sidebar = ({
  isSideBarOpen,
  setSideBarStatus,
  sections,
  leafNodeClickHandler,
  customSections,
  handleImportCustomBlocks,
}: SidebarProps) => {
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // These being booleans don't actually mean anything,
  // They just need to be values that can easily be changed in order
  // to trigger a useEffect in the children.
  // This is easily done by just toggling the booleans.
  const [expand, setExpand] = useState(false);
  const [collapse, setCollapse] = useState(false);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value === "") {
      setCollapse(!collapse);
    } else {
      setExpand(!expand);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const setFocus = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (isSideBarOpen) {
      setFocus();
    }
  }, [isSideBarOpen]);

  return (
    <div
      data-testid="sidebar"
      style={{
        top: LAYOUT_TOP_HEIGHT,
        height: `calc(100vh - ${LAYOUT_TOP_HEIGHT}px)`,
      }}
      className={cn(
        "absolute bottom-0 z-50 flex flex-col overflow-hidden bg-modal p-6 sm:w-96",
        isSideBarOpen ? "left-0 duration-500" : "-left-full duration-300",
      )}
    >
      <div className="absolute right-2 top-2">
        <div
          className="cursor-pointer rounded-xl p-1 transition duration-200 hover:bg-muted"
          data-testid="sidebar-close"
          onClick={() => setSideBarStatus(false)}
        >
          <XIcon size={20} className="stroke-muted-foreground" />
        </div>
      </div>
      <div>
        <div
          className={cn(
            "mt-4 flex w-[316px] items-center rounded-sm bg-background pl-2 focus:ring-2 focus:ring-accent1 focus-visible:ring-2 focus-visible:ring-accent1",
            { "ring-2 ring-accent1": searchFocused },
          )}
        >
          <Search size={18} className="stroke-muted-foreground" />
          <Input
            data-testid="sidebar-input"
            name="sidebar-input"
            placeholder="Search"
            className="border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            type="search"
            value={query}
            onChange={handleQueryChange}
            ref={inputRef}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
        <div className="py-1" />
        <div className="flex items-end">
          <a
            href={REQUEST_NODE_URL}
            target="_blank"
            className="w-fit no-underline"
          >
            <Button
              variant="link"
              className="px-2 font-semibold text-muted-foreground"
              data-testid="request-node-btn"
            >
              Request a block...
            </Button>
          </a>
          <div className="grow" />
          <div className="mb-2 flex items-center">
            <button
              data-testid="sidebar-expand-btn"
              onClick={() => setExpand(!expand)}
              className="text-gray-300 duration-200 hover:text-muted-foreground"
            >
              <ArrowDownWideNarrow />
            </button>
            <button
              data-testid="sidebar-collapse-btn"
              onClick={() => setCollapse(!collapse)}
              className="text-gray-300 duration-200 hover:text-muted-foreground"
            >
              <ArrowUpWideNarrow />
            </button>
          </div>
        </div>
      </div>
      <Tabs defaultValue="standard" className="mb-8 h-[80%]">
        <TabsList className="grid w-11/12 grid-cols-2">
          <TabsTrigger data-testid={"standard-blocks-tab"} value="standard">
            Standard
          </TabsTrigger>
          <TabsTrigger data-testid={"custom-blocks-tab"} value="custom">
            Custom
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="h-full overflow-y-scroll">
          {sections ? (
            <div className="w-11/12">
              <SidebarNode
                depth={0}
                leafClickHandler={leafNodeClickHandler}
                node={sections}
                query={query}
                matchedParent={false}
                expand={expand}
                collapse={collapse}
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="py-3">
                Standard blocks manifest not fetched correctly!
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="custom" className="h-full overflow-y-scroll">
          {customSections ? (
            <>
              <div className="w-11/12">
                <SidebarNode
                  depth={0}
                  leafClickHandler={leafNodeClickHandler}
                  node={customSections}
                  query={query}
                  matchedParent={false}
                  expand={expand}
                  collapse={collapse}
                />
              </div>
              <div className="flex w-full items-center justify-center pt-2">
                <Button
                  variant={"outline"}
                  onClick={() => handleImportCustomBlocks(false)}
                >
                  <ImportIcon size={26} className="pr-2" />
                  Change Custom Blocks Directory
                </Button>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <p className="py-3">No custom blocks found</p>
              <Button
                variant={"outline"}
                data-testid="import-custom-block"
                onClick={() => handleImportCustomBlocks(false)}
              >
                <ImportIcon size={26} className="pr-2" />
                Import Custom Blocks
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default memo(Sidebar);
