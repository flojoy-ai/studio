import {
  Navbar,
  ScrollArea,
  Input,
  useMantineTheme,
  createStyles,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import { memo, useEffect, useRef, useState } from "react";

import { NodeElement, NodeSection } from "@src/utils/ManifestLoader";
import SidebarNode from "./SidebarNode";
import { LAYOUT_TOP_HEIGHT } from "@src/feature/common/Layout";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, XIcon } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { REQUEST_NODE_URL } from "@src/data/constants";
import { cn } from "@src/lib/utils";

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
  const theme = useMantineTheme();

  const [query, setQuery] = useState("");

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
    <Navbar
      data-testid="sidebar"
      top={LAYOUT_TOP_HEIGHT}
      height={`calc(100vh - ${LAYOUT_TOP_HEIGHT}px)`}
      p="md"
      // className={isSideBarOpen ? classes.navbarView : classes.navbarHidden}
      className={cn(
        "absolute z-50 bg-modal sm:w-96",
        isSideBarOpen ? "left-0 duration-500" : "-left-full duration-300"
      )}
    >
      <Navbar.Section className="absolute right-2 top-2">
        <div
          className="cursor-pointer rounded-xl p-1"
          onClick={() => setSideBarStatus(false)}
        >
          <XIcon size={20} className="stroke-muted-foreground" />
        </div>
      </Navbar.Section>
      <Navbar.Section>
        <Input
          data-testid="sidebar-input"
          name="sidebar-input"
          placeholder="Search"
          icon={<IconSearch size={18} />}
          radius="sm"
          type="search"
          className="mt-8"
          value={query}
          onChange={handleQueryChange}
          ref={inputRef}
          styles={{
            input: {
              "&:focus": {
                borderColor: theme.colors.accent1[0],
              },
            },
          }}
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
      </Navbar.Section>
      <Navbar.Section grow className="mt-3" component={ScrollArea}>
        <SidebarNode
          depth={0}
          leafClickHandler={leafNodeClickHandler}
          node={sections}
          query={query}
          matchedParent={false}
          expand={expand}
          collapse={collapse}
        />
      </Navbar.Section>
    </Navbar>
  );
};

export default memo(Sidebar);
