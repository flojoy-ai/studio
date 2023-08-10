import { memo, useEffect, useRef, useState } from "react";

import { NodeElement, NodeSection } from "@src/utils/ManifestLoader";
import { LAYOUT_TOP_HEIGHT } from "@src/feature/common/Layout";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, XIcon } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { REQUEST_NODE_URL } from "@src/data/constants";
import { cn } from "@src/lib/utils";
import { Separator } from "@src/components/ui/separator";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";

export type LeafClickHandler = (elem: NodeElement) => void;

type SidebarProps = {
  isSideBarOpen: boolean;
  setSideBarStatus: React.Dispatch<React.SetStateAction<boolean>>;
  sections: NodeSection;
  leafNodeClickHandler: LeafClickHandler;
  customContent?: JSX.Element;
};

const Sidebar = ({
  isSideBarOpen,
  setSideBarStatus,
  sections,
  leafNodeClickHandler,
}: SidebarProps) => {
  const [query, setQuery] = useState("");

  console.log(sections);

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
      style={{ height: `calc(100vh - ${LAYOUT_TOP_HEIGHT}px)` }}
      className={cn(
        "absolute z-50 bg-modal sm:w-96",
        isSideBarOpen ? "left-0 duration-500" : "-left-full duration-300",
      )}
    >
      <div
        className="cursor-pointer rounded-xl p-1"
        onClick={() => setSideBarStatus(false)}
      >
        <XIcon size={20} className="stroke-muted-foreground" />
      </div>
      <Input
        data-testid="sidebar-input"
        name="sidebar-input"
        placeholder="Search"
        type="search"
        className="mt-8"
        value={query}
        onChange={handleQueryChange}
      />
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
          >
            Request a node...
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
      {sections.children.map((levelOne) => {
        return (
          <div>
            <Collapsible>
              <CollapsibleTrigger>{levelOne.name}</CollapsibleTrigger>
              <CollapsibleContent>
                {levelOne.entryType === "section" ? (
                  <>
                    {levelOne.children.map((levelTwo) => {
                      if (levelTwo.entryType === "section") {
                        return (
                          <div className="pl-2 text-sky-200">
                            <Collapsible>
                              <CollapsibleTrigger>
                                Section {levelTwo.name}
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <Separator className="h-1" />
                                {levelTwo.children.map((levelThree) => {
                                  if (levelThree.entryType === "section") {
                                    return (
                                      <div className="pl-4 text-red-500">
                                        More section {levelThree.name}
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div
                                        className="pl-4"
                                        onClick={() =>
                                          leafNodeClickHandler(levelThree)
                                        }
                                      >
                                        Leaf {levelThree.name}
                                      </div>
                                    );
                                  }
                                })}
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        );
                      } else {
                        return <div className="pl-2">Leaf</div>;
                      }
                    })}
                  </>
                ) : (
                  <div>Leaf</div>
                )}
              </CollapsibleContent>
            </Collapsible>
            <Separator className="h-1" />
          </div>
        );
      })}
    </div>
  );
};

export default memo(Sidebar);
