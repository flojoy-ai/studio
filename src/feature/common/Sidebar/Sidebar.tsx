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

const SidebarCustom = ({
  sections,
  //   leafNodeTemplate,
  manifestMap,
}: {
  sections: Node[];
  //   leafNodeTemplate: LeafNode;
  manifestMap: any; //Key value pair object
}) => {
  const [isSideBarOpen, setSideBarStatus] = useState(false);
  const [textInput, handleChangeInput] = useState("");
  const { classes, theme } = useSidebarStyles();
  const addButtonClass = useAddButtonStyle();

  //this function will create the sections to be rendered according to the search input
  const renderSection = (textInput: string, node: Node, depth: number) => {
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
              key={(node as LeafNode).key}
              onClickHandle={() => console.log("clicked")}
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
          if (content) {
            return (
              <SidebarSection
                key={node.title}
                title={node.title}
                content={content}
                depth={depth}
              />
            );
          }
        }
      }
      return null;

      //case 3: no search input
    } else {
      //case 3.1: node has children (is a section)
      if (node["child"] != null && !("key" in node)) {
        content = node.child.map(
          (c) => renderSection("", c, depth + 1) //render all the content of the children
        );
        return (
          <SidebarSection
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
            depth={depth}
            key={(node as LeafNode).key}
            onClickHandle={() => console.log("clicked")}
            keyNode={(node as LeafNode).key}
            manifestMap={manifestMap}
          />
        );
      }
    }
  };

  const handleSidebar = () => setSideBarStatus(!isSideBarOpen);

  return (
    <div>
      <button
        data-testid="add-node-button"
        className={addButtonClass.classes.addButton}
        onClick={handleSidebar}
        style={{
          position: "absolute",
          width: "104px",
          height: "43px",
          left: "0px",
          top: "110px",
          zIndex: 1,
        }}
      >
        + Add Node
      </button>
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
            onClick={handleSidebar}
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
          style={{
            paddingTop: "20px",
            paddingLeft: "100px",
          }}
        >
          <button
            style={{
              border: "2px solid #30d5c8",
              background: "transparent",
              borderRadius: "2px",
            }}
          >
            <Anchor
              style={{
                textDecoration: "none",
              }}
              href="https://toqo276pj36.typeform.com/to/F5rSHVu1"
              target="_blank"
            >
              <span
                style={{
                  // backgroundColor: "#93f4fc00",
                  color: "#30d5c8",
                }}
              >
                Request a Node
              </span>
            </Anchor>
          </button>
        </Navbar.Section>
        <Navbar.Section
          grow
          className={classes.sections}
          component={ScrollArea}
        >
          <div className={classes.sectionsInner}>
            {sections.map((section, i) => (
              <div key={i}>{renderSection(textInput, section, 0)}</div>
            ))}
          </div>
        </Navbar.Section>
      </Navbar>
    </div>
  );
};

export default SidebarCustom;
