import {
  Navbar,
  ScrollArea,
  createStyles,
  MantineProvider,
} from "@mantine/core";

import { useState } from "react";

import { SidebarSection } from "./SidebarSection";
import { SECTIONS } from "../manifest/COMMANDS_MANIFEST";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme,
    paddingBottom: 0,
    position: "fixed",
    top: "110px",
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

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
}));

export function Sidebar({ theme }) {
  const [isSideBarOpen, setSideBarStatus] = useState(false);
  const { classes } = useStyles();
  const links = SECTIONS.map((item) => (
    <SidebarSection {...item} key={item.title} />
  ));

  const handleSidebar = () => setSideBarStatus(!isSideBarOpen);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: theme,
      }}
    >
      <div>
        <button
          style={{
            border: "none",
            color: "black",
            padding: "15px 32px",
            textAlign: "center",
            textDecoration: "none",
            display: "flex",
            fontSize: "16px",
            margin: "4px 2px",
            cursor: "pointer",
            position: "absolute",
            zIndex: 999,
          }}
          onClick={handleSidebar}
        >
          + Add Node
        </button>
        {isSideBarOpen && (
          <Navbar
            height={800}
            width={{ sm: 387 }}
            p="md"
            className={classes.navbar}
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
                <i className="fa-sharp fa-solid fa-xmark"></i>
              </button>
            </Navbar.Section>
            <Navbar.Section
              grow
              className={classes.links}
              component={ScrollArea}
            >
              <div className={classes.linksInner}>{links}</div>
            </Navbar.Section>
          </Navbar>
        )}
      </div>
    </MantineProvider>
  );
}

// + ADD NODE: Move in,ease out, 500ms
// Close Button: Smart Animate, ease out, 300ms
