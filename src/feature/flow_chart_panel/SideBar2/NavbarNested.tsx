import {
  Navbar,
  Group,
  Code,
  ScrollArea,
  createStyles,
  MantineProvider,
} from "@mantine/core";
import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
} from "@tabler/icons";
import { useState } from "react";

import { LinksGroup } from "./NavbarLinksGroup";

const mockdata = [
  { label: "Dashboard", icon: IconGauge },
  {
    label: "Market news",
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: "Overview", link: "/" },
      { label: "Forecasts", link: "/" },
      { label: "Outlook", link: "/" },
      { label: "Real time", link: "/" },
    ],
  },
  {
    label: "Releases",
    icon: IconCalendarStats,
    links: [
      { label: "Upcoming releases", link: "/" },
      { label: "Previous releases", link: "/" },
      { label: "Releases schedule", link: "/" },
    ],
  },
  { label: "Analytics", icon: IconPresentationAnalytics },
  { label: "Contracts", icon: IconFileAnalytics },
  { label: "Settings", icon: IconAdjustments },
  {
    label: "Security",
    icon: IconLock,
    links: [
      { label: "Enable 2FA", link: "/" },
      { label: "Change password", link: "/" },
      { label: "Recovery codes", link: "/" },
    ],
  },
];

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

export function NavbarNested({ theme }) {
  const [isSideBarOpen, setSideBarStatus] = useState(false);
  const { classes } = useStyles();
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
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
            width={{ sm: 300 }}
            p="md"
            className={classes.navbar}
          >
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
