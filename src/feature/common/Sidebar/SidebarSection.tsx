import { useState } from "react";
import {
  createStyles,
  UnstyledButton,
  Group,
  Box,
  Collapse,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export const useSidebarStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    width: "90%",
    padding: `${theme.spacing.xs} ${theme.spacing.xs}`,
    color: "black",
    fontSize: theme.fontSizes.sm,
    margin: "10px 20px",
    backgroundColor: theme.colors.accent1[0],
  },

  chevron: {
    transition: "transform 200ms ease",
  },
}));

type SidebarSectionProps = {
  title: string;
  content: React.ReactNode;
  depth: number;
};

const SidebarSection = ({ title, content, depth }: SidebarSectionProps) => {
  const [opened, setOpened] = useState(false);
  const { classes, theme } = useSidebarStyles();
  const ChevronIcon = theme.dir === "ltr" ? IconChevronRight : IconChevronLeft;
  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
        data-cy="sidebar-section-btn"
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box ml="md">{title}</Box>
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
        <div style={{ paddingLeft: `${10 + (depth + 1) * 20}px` }}>
          {content}
        </div>
      </Collapse>
    </>
  );
};
export default SidebarSection;
