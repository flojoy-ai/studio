import { useState } from "react";
import {
  Navbar,
  ScrollArea,
  Input,
  Anchor,
  UnstyledButton,
  Group,
  Box,
  Collapse,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { useSidebarStyles } from "@src/styles/useSidebarStyles";

const SidebarSection = ({ title, content, depth }) => {
  const [opened, setOpened] = useState(false);
  const { classes, theme } = useSidebarStyles();
  const ChevronIcon = theme.dir === "ltr" ? IconChevronRight : IconChevronLeft;
  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
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
      <Collapse in={opened}>{content}</Collapse>
    </>
  );
};
export default SidebarSection;
