import { Navbar, ScrollArea, Input, Anchor } from "@mantine/core";

import { IconSearch } from "@tabler/icons";

import { useState } from "react";

import SidebarSection from "./SidebarSection";
import CloseIconSvg from "@src/utils/SidebarCloseSvg";
import { useAddButtonStyle } from "@src/styles/useAddButtonStyle";
import { useSidebarStyles } from "@src/styles/useSidebarStyles";
import SidebarNode from "./SidebarNode";

interface Node {
  title: string;
  child: Node[] | null;
}

interface LeafNode extends Node {
  key: string;
}

type leafClickHandler = (key: string) => void;

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
  const { classes, theme } = useSidebarStyles();
  const addButtonClass = useAddButtonStyle();

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
            <CloseIconSvg theme={theme.colorScheme} />
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
