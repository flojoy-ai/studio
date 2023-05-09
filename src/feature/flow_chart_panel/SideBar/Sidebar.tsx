import { Navbar, ScrollArea, createStyles, Input, Anchor } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import { useState } from "react";

import SidebarSection from "./SidebarSection";
import { COMMANDS, SECTIONS } from "../manifest/COMMANDS_MANIFEST";
import CloseIconSvg from "@src/utils/SidebarCloseSvg";

const useStyles = createStyles((theme) => ({
  navbarView: {
    paddingBottom: 0,
    position: "absolute",
    left: "0%",
    right: "0%",
    top: "110px",
    bottom: "0%",
    backgroundColor:
      theme.colorScheme === "dark" ? "#243438" : theme.colorScheme,
    boxShadow: "0px 4px 11px 3px rgba(0, 0, 0, 0.25)",
    height: "calc(100vh - 110px)",
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
    backgroundColor:
      theme.colorScheme === "dark" ? "#243438" : theme.colorScheme,
    boxShadow: "0px 4px 11px 3px rgba(0, 0, 0, 0.25)",
    height: "100%",
    transition: "300ms",
    zIndex: 1,
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  sections: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  sectionsInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  addButton: {
    boxSizing: "border-box",
    position: "absolute",
    width: "104px",
    height: "43px",
    left: "0px",
    top: "110px",
    background: theme.colorScheme === "dark" ? "#243438" : "#F6F7F8",
    border:
      theme.colorScheme === "dark" ? "1px solid #94F4FC" : "1px solid #E1E4E7",
    cursor: "pointer",
    zIndex: 1,
  },
}));

const Sidebar = () => {
  const [isSideBarOpen, setSideBarStatus] = useState(false);
  const [textInput, handleChangeInput] = useState("");
  const { classes, theme } = useStyles();

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
        className={classes.addButton}
        onClick={handleSidebar}
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

export default Sidebar;
