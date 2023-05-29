import { useState } from "react";
import {
  createStyles,
  UnstyledButton,
  Group,
  Box,
  Collapse,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Children } from "react";

export const useSidebarStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    width: "90%",
    padding: `${theme.spacing.xs} ${theme.spacing.xs}`,
    color: "black",
    fontSize: theme.fontSizes.sm,
    margin: "0px 20px 5px 20px",

    borderRadius: 2,
    backgroundColor: theme.colors.accent1[0],
  },
  title: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },

  chevron: {
    transition: "transform 200ms ease",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },
}));

type SidebarSectionProps = {
  title: string;
  depth: number;
  children: React.ReactNode;
};

const SidebarSection = ({ depth, title, children }: SidebarSectionProps) => {
  const [opened, setOpened] = useState(false);
  const { classes, theme } = useSidebarStyles();
  const ChevronIcon = theme.dir === "ltr" ? IconChevronRight : IconChevronLeft;

  if (Children.toArray(children).every((child) => child === null)) {
    return null;
  }

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
        data-cy="sidebar-section-btn"
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box ml="md" className={classes.title}>
              {title}
            </Box>
          </Box>
          <ChevronIcon
            className={classes.chevron}
            size={14}
            stroke="1.5"
            style={{
              transform: opened
                ? `rotate(${theme.dir === "rtl" ? -90 : 90}deg)`
                : "none",
            }}
          />
        </Group>
      </UnstyledButton>
      <Collapse in={opened}>
        {/* padding according to the depth of the section */}
        <div style={{ paddingLeft: `${10 + (depth + 1) * 8}px` }}>
          {children}
        </div>
      </Collapse>
    </>
  );
};
export default SidebarSection;
