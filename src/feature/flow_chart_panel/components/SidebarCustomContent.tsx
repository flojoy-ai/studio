import { Anchor, Button, createStyles, Flex } from "@mantine/core";
import { AddNewNode } from "../hooks/useAddNewNode";
import { useMemo } from "react";
import { NodeElement } from "@src/utils/ManifestLoader";

const useStyles = createStyles((theme) => {
  const accent =
    theme.colorScheme === "dark" ? theme.colors.accent1 : theme.colors.accent2;
  return {
    container: {
      borderBottom: `1px solid ${theme.colors.gray[5]}`,
    },
    reqBtn: {
      width: "fit-content",
      boxSizing: "border-box",
      backgroundColor: theme.colors.accent4[1],
      color: theme.colors.accent4[0],
      border: `1px solid ${theme.colors.accent4[0]}`,
      cursor: "pointer",
      zIndex: 100,
      fontWeight: 600,
      "&:hover": {
        backgroundColor: accent[1] + "36",
      },
    },
    span: {
      color: theme.colors.accent1[0],
    },
    endNode: {
      outline: "0",
      border: `2px solid ${theme.colors.accent1[0]}`,
      background: "transparent",
      color: theme.colors.accent1[0],
      padding: `${theme.spacing.xs}`,
      cursor: "pointer",
      margin: "5px",
      fontFamily: "monospace",
    },
  };
});

type SidebarCustomContentProps = {
  onAddNode: AddNewNode;
  nodesManifest: NodeElement[];
};

const SidebarCustomContent = ({
  onAddNode,
  nodesManifest,
}: SidebarCustomContentProps) => {
  const { classes } = useStyles();
  return (
    <Flex
      justify={"space-around"}
      align={"center"}
      py={4}
      className={classes.container}
    >
      <RequestNode classes={classes} />
      <EndNode
        classes={classes}
        onAddNode={onAddNode}
        nodesManifest={nodesManifest}
      />
    </Flex>
  );
};

const RequestNode = ({ classes }: { classes: Record<string, string> }) => {
  return (
    <Button className={classes.reqBtn} data-testid="request-node-btn">
      <Anchor
        style={{
          textDecoration: "none",
        }}
        href="https://toqo276pj36.typeform.com/to/F5rSHVu1"
        target="_blank"
      >
        <span className={classes.span}>Request a Node</span>
      </Anchor>
    </Button>
  );
};

type EndNodeProps = {
  classes: Record<string, string>;
  onAddNode: AddNewNode;
  nodesManifest: NodeElement[];
};

const EndNode = ({ classes, onAddNode, nodesManifest }: EndNodeProps) => {
  const nodeKey = "END";
  const endNode = useMemo(
    () => nodesManifest.find((n) => n.key === nodeKey),
    [nodesManifest]
  );
  return (
    <>
      {endNode ? (
        <button
          data-testid="end-node-btn"
          className={classes.endNode}
          onClick={() => {
            onAddNode(endNode);
          }}
        >
          {endNode.key}
        </button>
      ) : null}
    </>
  );
};

export default SidebarCustomContent;
