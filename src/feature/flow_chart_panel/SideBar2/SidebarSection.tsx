import { useState, useCallback } from "react";
import {
  Group,
  Box,
  Collapse,
  Text,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons";
import { SidebarSubSection } from "./SidebarSubSection";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { NodeOnAddFunc, ParamTypes } from "../types/NodeAddFunc";
import { v4 as uuidv4 } from "uuid";

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

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

interface LinksGroupProps {
  title: string;
  child?: { name: string; key: string }[];
}

const getNodePosition = () => {
  return {
    x: 50 + Math.random() * 20,
    y: 50 + Math.random() + Math.random() * 20,
  };
};

export function SidebarSection({ title, child }: LinksGroupProps) {
  const { classes, theme } = useStyles();
  const hasChilds = Array.isArray(child);
  const [opened, setOpened] = useState(false);
  const ChevronIcon = theme.dir === "ltr" ? IconChevronRight : IconChevronLeft;

  const { setNodes } = useFlowChartState();

  const onAdd: NodeOnAddFunc = useCallback(
    ({ key, params, type, inputs, customNodeId }) => {
      let functionName: string;
      const id = `${key}-${uuidv4()}`;
      if (key === "CONSTANT") {
        let constant = prompt("Please enter a numerical constant", "2.0");
        if (constant == null) {
          constant = "2.0";
        }
        functionName = constant;
      } else {
        functionName = prompt("Please enter a name for this node")!;
      }
      if (!functionName) return;
      const funcParams = params
        ? Object.keys(params).reduce(
            (
              prev: Record<
                string,
                {
                  functionName: string;
                  param: keyof ParamTypes;
                  value: string | number;
                }
              >,
              param
            ) => ({
              ...prev,
              [key + "_" + functionName + "_" + param]: {
                functionName: key,
                param,
                value:
                  key === "CONSTANT" ? +functionName : params![param].default,
              },
            }),
            {}
          )
        : {};

      const newNode = {
        id: id,
        type: customNodeId || type,
        data: {
          id: id,
          label: functionName,
          func: key,
          type,
          ctrls: funcParams,
          inputs,
        },
        position: getNodePosition(),
      };
      setNodes((els) => els.concat(newNode));
    },
    [setNodes]
  );

  const items = (hasChilds ? child : []).map((c) => (
    // <div>
    //   <Text<"span">
    //     component="span"
    //     className={classes.link}
    //     key={c.name}
    //     onClick={(event) => event.preventDefault()}
    //   >
    //     {c.name}
    //   </Text>
    // </div>
    <Text<"div"> component="div" className={classes.link} key={c.name}>
      <SidebarSubSection subSection={c} onAdd={onAdd} />
    </Text>
  ));

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
          {hasChilds && (
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
          )}
        </Group>
      </UnstyledButton>
      {hasChilds ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
