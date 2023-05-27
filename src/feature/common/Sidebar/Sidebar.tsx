import { Navbar, ScrollArea, Input } from "@mantine/core";

import { IconSearch } from "@tabler/icons-react";

import { memo, useState } from "react";

import SidebarSection from "./SidebarSection";
import CloseIconSvg from "@src/utils/SidebarCloseSvg";
import SidebarNode from "./SidebarNode";
import { createStyles } from "@mantine/core";
import {
  CommandManifestMap,
  Sections,
} from "@src/feature/flow_chart_panel/manifest/COMMANDS_MANIFEST";

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
  sections: Sections;
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
  const [textInput, handleChangeInput] = useState("");
  const { classes } = useSidebarStyles();

  //this function will create the sections to be rendered according to the search input
  const renderSection = (textInput: string, node: Sections, depth: number) => {
    //if we are at the root
    if (node.title === "ROOT") {
      if (!node.child) return null;
      return node.child.map(
        (c) => renderSection(textInput, c as Sections, depth) //render all the content of the children
      );
    }

    let content: JSX.Element[];

    if (textInput !== "") {
      //case 1: name is included in the string of the section node or leaf node
      if (node.title.toLowerCase().includes(textInput.toLocaleLowerCase())) {
        //case 1.1: node has children (is a section)
        if (node["child"] !== null && !("key" in node)) {
          content = node.child.map(
            (c) => renderSection("", c as Sections, depth + 1) //render all the content of the children
          );
          return (
            <SidebarSection
              data-testid="sidebar-section"
              key={node.title}
              title={node.title}
              content={content}
              depth={depth}
            />
          );

          //case 1.2: node has no children (is a leaf/command)
        } else if (node["child"] === null && "key" in node) {
          return (
            <SidebarNode
              data-testid="sidebar-node"
              key={node.title}
              onClickHandle={() => leafNodeClickHandler(node.key as string)}
              keyNode={node.key as string}
              manifestMap={manifestMap}
              depth={depth}
            />
          );
        }

        //case 2: name is not included in the string of the section node or leaf node
      } else {
        //case 2.1: node has children (is a section)
        if (node["child"] !== null && !("key" in node)) {
          content = node.child.map(
            (c) => renderSection(textInput, c as Sections, depth + 1) //render all the content of the children
          );

          //if the content is not empty, then the section is not empty
          if (!content.every((value) => value === null)) {
            return (
              <SidebarSection
                data-testid="sidebar-section"
                key={node.title}
                title={node.title}
                content={content}
                depth={depth}
              />
            );
          }
        }
      }

      //case 3: no search input
    } else {
      //case 3.1: node has children (is a section)
      if (node["child"] !== null && !("key" in node)) {
        content = node.child.map(
          (c) => renderSection("", c as Sections, depth + 1) //render all the content of the children
        );
        return (
          <SidebarSection
            data-testid="sidebar-section"
            key={node.title}
            title={node.title}
            content={content}
            depth={depth}
          />
        );

        //case 3.2: node has no children (is a leaf/command)
      } else if (node["child"] === null && "key" in node) {
        return (
          <SidebarNode
            data-testid="sidebar-node"
            depth={depth}
            key={node.key as string}
            onClickHandle={leafNodeClickHandler}
            keyNode={node.key as string}
            manifestMap={manifestMap}
          />
        );
      }
    }
    return null;
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
          value={textInput}
          onChange={(e) => handleChangeInput(e.target.value)}
        />
      </Navbar.Section>
      {customContent}
      <Navbar.Section grow className={classes.sections} component={ScrollArea}>
        <div className={classes.sectionsInner} data-testid="sidebar-sections">
          {renderSection(textInput, sections, 0)}
        </div>
      </Navbar.Section>
    </Navbar>
  );
};

export default memo(Sidebar);
