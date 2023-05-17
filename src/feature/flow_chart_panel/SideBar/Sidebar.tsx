import { Navbar, ScrollArea, createStyles, Input, Anchor } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import { useState } from "react";

import SidebarSection from "./SidebarSection";
import { COMMANDS, SECTIONS } from "../manifest/COMMANDS_MANIFEST";
import CloseIconSvg from "@src/utils/SidebarCloseSvg";
import React from "react";

export const useAddButtonStyle = createStyles((theme) => {
  return {
    addButton: {
      boxSizing: "border-box",
      backgroundColor: theme.colors.accent4[1],
      color: theme.colors.accent4[0],
      border: `1px solid ${theme.colors.accent4[0]}`,
      cursor: "pointer",
    },
  };
});

export const useSidebarStyles = createStyles((theme) => ({
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

const Sidebar = () => {
  const [isSideBarOpen, setSideBarStatus] = useState(false);
  const [textInput, handleChangeInput] = useState("");
  const { classes, theme } = useSidebarStyles();
  const addButtonClass = useAddButtonStyle();

  const renderSections = () => {
    if (textInput !== "") {
      const childSectionList: string[] = [];

      // Getiing the command type from COMMANDS list.
      COMMANDS.map((cmd, cmdIndex) => {
        if (
          cmd.name.toLowerCase().includes(textInput.toLowerCase()) &&
          !childSectionList.includes(cmd.type)
        ) {
          childSectionList.push(cmd.type);
        }
        return null;
      });

      // getting the sections from the commands type, by iterating the SECTIONS list
      const toBeRenderedComponents = childSectionList.map((item, _) => {
        return SECTIONS.map((section, _) => {
          return section.child.map((child, _) => {
            if (child.key === item) {
              return <SidebarSection {...section} key={section.title} />;
            }
            return <></>;
          });
        });
      });

      return toBeRenderedComponents;
    }

    const sections = SECTIONS.map((item) => (
      <SidebarSection
        data-testid="sidebar-section"
        {...item}
        key={item.title}
      />
    ));
    return sections;
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
          margin: "10px",
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
          <div className={classes.sectionsInner}>{renderSections()}</div>
        </Navbar.Section>
      </Navbar>
    </div>
  );
};

export default React.memo(Sidebar);
