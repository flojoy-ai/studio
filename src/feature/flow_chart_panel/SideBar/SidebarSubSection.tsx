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
import { NodeOnAddFunc } from "../types/NodeAddFunc";

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    width: "90%",
    padding: "10px 16px",
    paddingLeft: "31px",
    fontSize: theme.fontSizes.sm,
    borderLeft: "1px solid #dee2e6",
    backgroundColor: theme.colorScheme === "dark" ? "#94F4FC" : "#E1E4E7",
    height: "100%",
    color: "black",
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
  },

  chevron: {
    transition: "transform 200ms ease",
  },

  subSection: {
    fontWeight: 500,
    display: "block",
    textDecoration: "none",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    paddingLeft: 31,
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    borderLeft: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
  buttonDark: {
    outline: "0",
    border: "1px solid rgba(153, 245, 255, 1)",
    backgroundColor: "rgba(153, 245, 255, 0.2)",
    color: "rgba(153, 245, 255, 1)",
    padding: "8px 12px 8px 12px",
    cursor: "pointer",
    margin: "5px 5px",
  },
  buttonLight: {
    outline: 0,
    border: "1px solid rgba(123, 97, 255, 1)",
    backgroundColor: "rgba(123, 97, 255, 0.17)",
    color: "rgba(123, 97, 255, 1)",
    padding: "8px 12px 8px 12px",
    cursor: "pointer",
    margin: "5px 5px",
  },
}));

interface SubSectionProps {
  subSection: {
    name: string;
    key: string;
    child?: { name: string; key: string }[];
  };
  onAdd: NodeOnAddFunc;
}

const SidebarSubSection = ({ subSection, onAdd }: SubSectionProps) => {
  const { classes, theme } = useStyles();
  const [opened, setOpened] = useState(false);
  const ChevronIcon = theme.dir === "ltr" ? IconChevronRight : IconChevronLeft;

  const items = (
    <Text<"div">
      component="div"
      className={classes.subSection}
      key={`${subSection}`}
    >
      {COMMANDS.map((cmd, cmdIndex) => (
        <Fragment key={cmdIndex}>
          {subSection.key === cmd.type && (
            <button
              className={
                theme.colorScheme === "dark"
                  ? classes.buttonDark
                  : classes.buttonLight
              }
              onClick={() => {
                onAdd({
                  funcName: cmd.key,
                  type: cmd.type,
                  params: FUNCTION_PARAMETERS[cmd.key],
                  inputs: cmd.inputs,
                  ...(cmd.ui_component_id && {
                    uiComponentId: cmd.ui_component_id,
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
    </Text>
  );

  return (
    <>
      <UnstyledButton
        data-testid="sidebar-subsection-button"
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box ml="md">{subSection?.name}</Box>
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
      <Collapse data-testid="sidebar-subsection-collapse" in={opened}>
        {subSection.child
          ? subSection.child.map((child) => (
            <div style={{padding:"10px 10px 0 10px"}}>

              <SidebarSubSection onAdd={onAdd} subSection={child} />
            </div>
            ))
          : items}
      </Collapse>
    </>
  );
};

export default SidebarSubSection;
