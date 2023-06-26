import {
  Navbar,
  ScrollArea,
  Input,
  UnstyledButton,
  Box,
  useMantineTheme,
  createStyles,
} from "@mantine/core";
import {
  IconArrowAutofitUp,
  IconArrowAutofitDown,
  IconSearch,
} from "@tabler/icons-react";

import { memo, useEffect, useRef, useState } from "react";

import CloseIconSvg from "@src/utils/SidebarCloseSvg";
import { NodeElement, NodeSection } from "@src/utils/ManifestLoader";
import SidebarNode from "./SidebarNode";
import {
  ControlElement,
  ControlSection,
} from "@src/feature/controls_panel/manifest/CONTROLS_MANIFEST";

export type LeafClickHandler = (elem: NodeElement | ControlElement) => void;

const useSidebarStyles = createStyles((theme) => {
  const accent =
    theme.colorScheme === "dark" ? theme.colors.accent1 : theme.colors.accent2;
  return {
    navbarView: {
      position: "absolute",
      top: "150px",
      height: "calc(100vh - 150px)",
      backgroundColor: theme.colors.modal[0],
      boxShadow: "0px 4px 11px 3px rgba(0, 0, 0, 0.25)",
      transition: "500ms",
      zIndex: 50,
    },
    navbarHidden: {
      position: "absolute",
      left: "-100%",
      top: "150px",
      backgroundColor: theme.colors.modal[0],
      boxShadow: "0px 4px 11px 3px rgba(0, 0, 0, 0.25)",
      height: "calc(100vh - 150px)",
      transition: "300ms",
      zIndex: 50,
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
      border: `1px solid ${accent[0]}`,
      backgroundColor: accent[0],
      color: accent[0],
      padding: "8px 12px 8px 12px",
      cursor: "pointer",
      margin: "5px 5px",
    },

    searchBox: {
      marginTop: 30,
    },

    expandCollapseButtonContainer: {
      display: "flex",
      justifyContent: "end",
      gap: 2,
      marginBottom: 10,
      marginRight: 12,
    },

    uiButton: {
      transition: "0.2s ease-in-out",
      "&:hover": {
        color: accent[0],
      },
    },

    closeButton: {
      cursor: "pointer",
      borderRadius: 32,
      padding: 8,
      transition: "50ms ease-in-out",
      "&:hover": {
        backgroundColor: accent[0] + "4f",
      },
      "& div": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 9,
        height: 9,
      },
    },
  };
});

export type AppTab = "FlowChart" | "Control" | "Result";
type SidebarCustomProps = {
  isSideBarOpen: boolean;
  setSideBarStatus: React.Dispatch<React.SetStateAction<boolean>>;
  sections: NodeSection | ControlSection;
  leafNodeClickHandler: LeafClickHandler;
  customContent?: JSX.Element;
  appTab: AppTab;
};

const Sidebar = ({
  isSideBarOpen,
  setSideBarStatus,
  sections,
  leafNodeClickHandler,
  customContent,
  appTab,
}: SidebarCustomProps) => {
  const theme = useMantineTheme();

  const [query, setQuery] = useState("");
  const { classes } = useSidebarStyles();

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
        <UnstyledButton
          data-testid="sidebar-close"
          onClick={() => setSideBarStatus(false)}
          className={classes.closeButton}
        >
          <CloseIconSvg />
        </UnstyledButton>
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
          ref={inputRef}
          styles={{
            input: {
              "&:focus": {
                borderColor: theme.colors.accent1[0],
              },
            },
          }}
        />
      </Navbar.Section>
      {customContent}
      <Navbar.Section grow className={classes.sections} component={ScrollArea}>
        <Box className={classes.expandCollapseButtonContainer}>
          <UnstyledButton
            onClick={() => setExpand(!expand)}
            className={classes.uiButton}
          >
            <IconArrowAutofitDown />
          </UnstyledButton>
          <UnstyledButton
            onClick={() => setCollapse(!collapse)}
            className={classes.uiButton}
          >
            <IconArrowAutofitUp />
          </UnstyledButton>
        </Box>
        <SidebarNode
          depth={0}
          leafClickHandler={leafNodeClickHandler}
          node={sections}
          query={query}
          matchedParent={false}
          expand={expand}
          collapse={collapse}
          appTab={appTab}
        />
      </Navbar.Section>
    </Navbar>
  );
};

export default memo(Sidebar);
