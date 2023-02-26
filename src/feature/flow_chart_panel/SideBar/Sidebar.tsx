import {
  Navbar,
  ScrollArea,
  createStyles,
  MantineProvider,
  Flex,
  Input,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons";

import { useState } from "react";

import { SidebarSection } from "./SidebarSection";
import { COMMANDS, SECTIONS } from "../manifest/COMMANDS_MANIFEST";
import CloseIconSvg from "@src/utils/SidebarCloseSvg";

type SectionType = {
  title: string;
  child: { name: string; key: string }[];
}[];

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

  addButton: {
    boxSizing: "border-box",
    position: "absolute",
    width: "104px",
    height: "43px",
    left: "0px",
    top: "110px",
    background: appTheme === "dark" ? "#243438" : "#F6F7F8",
    border: appTheme === "dark" ? "1px solid #94F4FC" : "1px solid #E1E4E7",
    cursor: "pointer",
    zIndex: 999,
  },
}));

export function Sidebar({ appTheme }) {
  const [isSideBarOpen, setSideBarStatus] = useState(false);
  const [textInput, handleChangeInput] = useState("");
  const { classes, theme } = useStyles({ appTheme });

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

    return SECTIONS.map((item) => (
      <SidebarSection {...item} key={item.title} />
    ));
  };

  const handleSidebar = () => setSideBarStatus(!isSideBarOpen);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ ...theme, colorScheme: appTheme }}
    >
      <div>
        <button className={classes.addButton} onClick={handleSidebar}>
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
              <CloseIconSvg />
            </button>
          </Navbar.Section>
          <Navbar.Section>
            <Input
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
            <div className={classes.sectionsInner}>{renderSections()}</div>
          </Navbar.Section>
        </Navbar>
      </div>
    </MantineProvider>
  );
}
