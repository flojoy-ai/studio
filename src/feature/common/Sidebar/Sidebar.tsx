import { Navbar, ScrollArea, Input, Anchor } from "@mantine/core";

import { IconSearch } from "@tabler/icons-react";

import { useState } from "react";

import SidebarSection from "./SidebarSection";
import CloseIconSvg from "@src/utils/SidebarCloseSvg";
import SidebarNode from "./SidebarNode";
import { createStyles } from "@mantine/core";

interface Node {
  title: string;
  child: Node[] | null;
}

interface LeafNode extends Node {
  key: string;
}

type leafClickHandler = (key: string) => void;

export const useAddButtonStyle = createStyles((theme) => {
  return {
    addButton: {
      boxSizing: "border-box",
      backgroundColor: theme.colors.modal[0],
      border: theme.colors.accent1[0],
      cursor: "pointer",
    },
  };
});

const useSidebarStyles = createStyles((theme) => ({
  navbarView: {
    paddingBottom: 0,
    position: "absolute",
    left: "0%",
    right: "0%",
    top: "110px",
    bottom: "0%",
    backgroundColor: theme.colors.modal[0],
    boxShadow: "0px 4px 11px 3px rgba(0, 0, 0, 0.25)",
    height: "100%",
    transition: "500ms",
    zIndex: 1,
  },

  navbarHidden: {
    paddingBottom: 0,
    position: "absolute",
    left: "-100%",
    right: "0%",
    top: "110px",
    bottom: "0%",
    backgroundColor: theme.colors.modal[0],
    boxShadow: "0px 4px 11px 3px rgba(0, 0, 0, 0.25)",
    height: "100%",
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
}));

const SidebarCustom = ({
  isSideBarOpen,
  setSideBarStatus,
  sections,
  leafNodeClickHandler,
  manifestMap,
}: {
  isSideBarOpen: boolean;
  setSideBarStatus: React.Dispatch<React.SetStateAction<boolean>>;
  sections: Node;
  leafNodeClickHandler: leafClickHandler;
  manifestMap: any; //Key value pair object
}) => {
  const [textInput, handleChangeInput] = useState("");
  const addButtonClass = useAddButtonStyle();
  const { classes } = useSidebarStyles();

  //this function will create the sections to be rendered according to the search input
  const renderSection = (textInput: string, node: Node, depth: number) => {
    //if we are at the root
    if (node.title === "ROOT") {
      if (!node.child) return null;
      return node.child.map(
        (c) => renderSection(textInput, c, depth) //render all the content of the children
      );
    }

    var content;

    if (textInput !== "") {
      //case 1: name is included in the string of the section node or leaf node
      if (node.title.toLowerCase().includes(textInput.toLocaleLowerCase())) {
        //case 1.1: node has children (is a section)
        if (node["child"] != null && !("key" in node)) {
          content = node.child.map(
            (c) => renderSection("", c, depth + 1) //render all the content of the children
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
        } else if (node["child"] == null && "key" in node) {
          return (
            <SidebarNode
              data-testid="sidebar-node"
              key={(node as LeafNode).key}
              onClickHandle={() => leafNodeClickHandler((node as LeafNode).key)}
              keyNode={(node as LeafNode).key}
              manifestMap={manifestMap}
              depth={depth}
            />
          );
        }

        //case 2: name is not included in the string of the section node or leaf node
      } else {
        //case 2.1: node has children (is a section)
        if (node["child"] != null && !("key" in node)) {
          content = node.child.map(
            (c) => renderSection(textInput, c, depth + 1) //render all the content of the children
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
      if (node["child"] != null && !("key" in node)) {
        content = node.child.map(
          (c) => renderSection("", c, depth + 1) //render all the content of the children
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
      } else if (node["child"] == null && "key" in node) {
        return (
          <SidebarNode
            data-testid="sidebar-node"
            depth={depth}
            key={(node as LeafNode).key}
            onClickHandle={() => leafNodeClickHandler((node as LeafNode).key)}
            keyNode={(node as LeafNode).key}
            manifestMap={manifestMap}
          />
        );
      }
    }
    return null;
  };

  return (
    <div>
      <Navbar
        data-testid="sidebar"
        height={800}
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
            style={{
              marginTop: "30px",
              background: "inherit",
            }}
            value={textInput}
            onChange={(e) => handleChangeInput(e.target.value)}
          />
        </Navbar.Section>
        <Navbar.Section
          grow
          className={classes.sections}
          component={ScrollArea}
        >
          <div className={classes.sectionsInner}>
            {renderSection(textInput, sections, 0)}
          </div>
        </Navbar.Section>
      </Navbar>
    </div>
  );
};

export default SidebarCustom;
