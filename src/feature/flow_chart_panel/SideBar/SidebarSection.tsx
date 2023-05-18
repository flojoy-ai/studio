import { useState, useCallback } from "react";
import {
  Group,
  Box,
  Collapse,
  Text,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import SidebarSubSection from "./SidebarSubSection";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { NodeOnAddFunc, ParamTypes } from "../types/NodeAddFunc";
import { v4 as uuidv4 } from "uuid";
import { ElementsData } from "../types/CustomNodeProps";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { memo } from "react";
import { Node } from "reactflow";
import { Draft } from "immer";

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    width: "90%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: "black",
    fontSize: theme.fontSizes.sm,
    margin: "10px 20px 10px 20px",
    backgroundColor: theme.colorScheme === "dark" ? "#94F4FC" : "#E1E4E7",
  },

  subSection: {
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
}));

interface LinksGroupProps {
  title: string;
  child?: {
    name: string;
    key: string;
    child?: { name: string; key: string }[];
  }[];
  setNodes: (
    update:
      | Node<ElementsData>[]
      | ((draft: Draft<Node<ElementsData>>[]) => void)
  ) => void;
}

const getNodePosition = () => {
  return {
    x: 50 + Math.random() * 20,
    y: 50 + Math.random() + Math.random() * 20,
  };
};

const SidebarSection = ({ title, child, setNodes }: LinksGroupProps) => {
  const { classes, theme } = useStyles();
  const hasChilds = Array.isArray(child);
  const [opened, setOpened] = useState(false);
  const ChevronIcon = theme.dir === "ltr" ? IconChevronRight : IconChevronLeft;

  const addNewNode: NodeOnAddFunc = useCallback(
    ({ funcName, params, type, inputs, uiComponentId, pip_dependencies }) => {
      let nodeLabel: string;
      const nodeId = `${funcName}-${uuidv4()}`;
      if (funcName === "CONSTANT") {
        nodeLabel = "2.0";
      } else {
        nodeLabel = funcName;
        // TODO: Re-add this feature
        // Can probably cache the number node per type in state,
        // creating a dependency on nodes in this component is
        // extremely expensive.

        // const numOfThisNodesOnChart = nodes.filter(
        //   (node) => node.data.func === funcName
        // ).length;
        // nodeLabel =
        //   numOfThisNodesOnChart > 0
        //     ? `${funcName}_${numOfThisNodesOnChart}`
        //     : funcName;
      }
      const nodeParams = params
        ? Object.keys(params).reduce(
            (prev: ElementsData["ctrls"], param) => ({
              ...prev,
              [param]: {
                functionName: funcName,
                param,
                value:
                  funcName === "CONSTANT"
                    ? nodeLabel
                    : params![param].default?.toString(),
              },
            }),
            {}
          )
        : {};

      const newNode = {
        id: nodeId,
        type: uiComponentId || type,
        data: {
          id: nodeId,
          label: nodeLabel,
          func: funcName,
          type,
          ctrls: nodeParams,
          inputs,
          pip_dependencies,
        },
        position: getNodePosition(),
      };
      setNodes((els) => els.concat(newNode));
    },
    [setNodes]
  );

  const items = (hasChilds ? child : []).map((c) => (
    <Text<"div"> component="div" className={classes.subSection} key={c.name}>
      <SidebarSubSection subSection={c} onAdd={addNewNode} />
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
};

export default memo(SidebarSection);
