import { useState, Fragment } from "react";
import {
  Group,
  Box,
  Collapse,
  Text,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { COMMANDS } from "../manifest/COMMANDS_MANIFEST";
import { FUNCTION_PARAMETERS } from "../manifest/PARAMETERS_MANIFEST";

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    width: "100%",
    // padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    padding: "10px 16px",
    paddingLeft: "31px",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,
    borderLeft: "1px solid #dee2e6",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  link: {
    fontWeight: 500,
    display: "block",
    textDecoration: "none",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    paddingLeft: 31,
    marginLeft: 30,
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    borderLeft: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  chevron: {
    transition: "transform 200ms ease",
  },
}));

interface SubSectionProps {
  subSection: { name: string; key: string };
  onAdd: any;
}

export function SidebarSubSection({ subSection, onAdd }: SubSectionProps) {
  const { classes, theme } = useStyles();
  const [opened, setOpened] = useState(false);
  const ChevronIcon = theme.dir === "ltr" ? IconChevronRight : IconChevronLeft;

  const items = (
    <div
      className="flex"
      style={{
        gap: "8px",
        alignItems: "center",
        width: "fit-content",
        flexWrap: "wrap",
      }}
    >
      {COMMANDS.map((cmd, cmdIndex) => (
        <Fragment key={cmdIndex}>
          {subSection.key === cmd.type && (
            <button
              className={
                theme.colorScheme === "dark" ? "cmd-btn-dark" : "cmd-btn"
              }
              onClick={() => {
                onAdd({
                  key: cmd.key,
                  type: cmd.type,
                  params: FUNCTION_PARAMETERS[cmd.key],
                  inputs: cmd.inputs,
                  ...(cmd.ui_component_id && {
                    customNodeId: cmd.ui_component_id,
                  }),
                });
              }}
              key={cmd.name}
            >
              {cmd.name}
            </button>
          )}
        </Fragment>
      ))}
    </div>
  );

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box ml="md">{subSection?.key}</Box>
          </Box>
          <ChevronIcon
            className={classes.chevron}
            size={14}
            stroke={1.5}
            style={{
              transform: opened
                ? `rotate(${theme.dir === "rtl" ? -90 : 90}deg)`
                : "none",
            }}
          />
        </Group>
      </UnstyledButton>
      <Collapse in={opened}>{items}</Collapse>
    </>
  );
}
