import { Navbar, ScrollArea, Input } from "@mantine/core";

import { IconSearch } from "@tabler/icons-react";

import { memo, useState } from "react";

import CloseIconSvg from "@src/utils/SidebarCloseSvg";
import { createStyles } from "@mantine/core";
import {
  CommandManifestMap,
  CommandSection,
} from "@src/feature/flow_chart_panel/manifest/COMMANDS_MANIFEST";
import SidebarNode from "./SidebarNode";

type leafClickHandler = (key: string) => void;

const useSidebarStyles = createStyles((theme) => ({
  navbarView: {
    position: "absolute",
    top: "100px",
    height: "calc(100vh - 100px)",
    backgroundColor: theme.colors.modal[0],
    boxShadow: "0px 4px 11px 3px rgba(0, 0, 0, 0.25)",
    transition: "500ms",
    zIndex: 1,
  },

  navbarHidden: {
    position: "absolute",
    left: "-100%",
    top: "100px",
    backgroundColor: theme.colors.modal[0],
    boxShadow: "0px 4px 11px 3px rgba(0, 0, 0, 0.25)",
    height: "calc(100vh - 100px)",
    transition: "300ms",
    zIndex: 1,
  },

  sections: {
    marginTop: theme.spacing.md,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  sectionsInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  button: {
    outline: "0",
    border: `1px solid ${theme.colors.accent1[0]}`,
    backgroundColor: theme.colors.accent1[0],
    color: theme.colors.accent1[0],
    padding: "8px 12px 8px 12px",
    cursor: "pointer",
    margin: "5px 5px",
  },

  searchBox: {
    marginTop: 30,
  },
}));

type SidebarCustomProps = {
  isSideBarOpen: boolean;
  setSideBarStatus: React.Dispatch<React.SetStateAction<boolean>>;
  sections: CommandSection;
  leafNodeClickHandler: leafClickHandler;
  manifestMap: CommandManifestMap;
  customContent?: JSX.Element;
};

const Sidebar = ({
  isSideBarOpen,
  setSideBarStatus,
  sections,
  leafNodeClickHandler,
  manifestMap,
  customContent,
}: SidebarCustomProps) => {
  const [query, setQuery] = useState("");
  const { classes } = useSidebarStyles();

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <Navbar
      data-testid="sidebar"
      height={200}
      width={{ sm: 387 }}
      p="md"
      className={isSideBarOpen ? classes.navbarView : classes.navbarHidden}
    >
      <Navbar.Section
        style={{
          right: 10,
          position: "absolute",
          top: 5,
        }}
      >
        <button
          data-testid="sidebar-close"
          onClick={() => setSideBarStatus(false)}
          style={{
            cursor: "pointer",
          }}
        >
          <CloseIconSvg />
        </button>
      </Navbar.Section>
      <Navbar.Section>
        <Input
          data-testid="sidebar-input"
          name="sidebar-input"
          placeholder="Search"
          icon={<IconSearch size={18} />}
          radius="sm"
          type="search"
          className={classes.searchBox}
          value={query}
          onChange={handleQueryChange}
        />
      </Navbar.Section>
      {customContent}
      <Navbar.Section grow className={classes.sections} component={ScrollArea}>
        <SidebarNode
          depth={0}
          leafClickHandler={leafNodeClickHandler}
          manifestMap={manifestMap}
          node={sections}
          query={query}
          matchedParent={false}
        />
      </Navbar.Section>
    </Navbar>
  );
};

export default memo(Sidebar);
