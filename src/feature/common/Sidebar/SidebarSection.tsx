import { useEffect, useState } from "react";
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
    // color: "black",
    fontSize: theme.fontSizes.sm,
    margin: "0px 20px 10px 20px",
    // borderRadius: 2,
    // border: '2px solid rgba(103, 9, 182, 0.95)',
    // // backgroundColor: "#C3A8ff",
    // backgroundColor: "rgba(103, 9, 182, 0.01)",
  },
  title: {
    color: "rgba(103, 9, 182, 0.95)"
      // theme.colorScheme === "dark"
      //   ? theme.colors.dark[6]
      //   : theme.colors.gpderay[0],
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
  expand: boolean;
  collapse: boolean;
};

const SidebarSection = ({
  depth,
  title,
  children,
  expand,
  collapse,
}: SidebarSectionProps) => {
  const [opened, setOpened] = useState(false);
  const { classes, theme } = useSidebarStyles();
  const ChevronIcon = theme.dir === "ltr" ? IconChevronRight : IconChevronLeft;

  useEffect(() => {
    setOpened(true);
  }, [expand]);

  useEffect(() => {
    setOpened(false);
  }, [collapse]);

  if (Children.toArray(children).every((child) => child === null)) {
    return null;
  }

  const categoryColors = (category: string) => {
    if (category == "AI_ML" || category == "Generate" || category == "Visualize"){
      return <div style={{  borderRadius: 2, border: '2px solid rgba(103, 9, 182, 0.95)', backgroundColor: "rgba(103, 9, 182, 0.01)",}}>{category}</div>
    }
  }

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
        data-cy="sidebar-section-btn"
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: "flex", alignItems: "center"}}>
            <Box ml="md">
              {categoryColors(title)}
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
        <Box style={{ paddingLeft: `${10 + (depth + 1) * 8}px` }}>
          {children}
        </Box>
      </Collapse>
    </>
  );
};
export default SidebarSection;
