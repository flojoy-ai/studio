import {
  Navbar,
  ScrollArea,
  createStyles,
  MantineProvider,
} from "@mantine/core";

import { useState } from "react";

import { SidebarSection } from "./SidebarSection";
import { SECTIONS } from "../manifest/COMMANDS_MANIFEST";

interface ThemeProps {
  appTheme: "dark" | "light";
}

const useStyles = createStyles((theme, { appTheme }: ThemeProps) => ({
  navbarView: {
    paddingBottom: 0,
    position: "absolute",
    left: "0%",
    right: "0%",
    top: "110px",
    bottom: "0%",
    backgroundColor: appTheme === "dark" ? "#243438" : appTheme,
    boxShadow: "0px 4px 11px 3px rgba(0, 0, 0, 0.25)",
    height: "100%",
    transition: "500ms",
  },

  navbarHidden: {
    paddingBottom: 0,
    position: "absolute",
    left: "-25%",
    right: "0%",
    top: "110px",
    bottom: "0%",
    backgroundColor: appTheme === "dark" ? "#243438" : appTheme,
    boxShadow: "0px 4px 11px 3px rgba(0, 0, 0, 0.25)",
    height: "100%",
    transition: "300ms",
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
}));

export function Sidebar({ appTheme }) {
  const [isSideBarOpen, setSideBarStatus] = useState(false);
  const { classes, theme } = useStyles({ appTheme });
  const sections = SECTIONS.map((item) => (
    <SidebarSection {...item} key={item.title} />
  ));

  const handleSidebar = () => setSideBarStatus(!isSideBarOpen);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ ...theme, colorScheme: appTheme }}
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
        <Navbar
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
              X
            </button>
          </Navbar.Section>
          <Navbar.Section
            grow
            className={classes.sections}
            component={ScrollArea}
          >
            <div className={classes.sectionsInner}>{sections}</div>
          </Navbar.Section>
        </Navbar>
      </div>
    </MantineProvider>
  );
}

// + ADD NODE: Move in,ease out, 500ms
// Close Button: Smart Animate, ease out, 300ms
