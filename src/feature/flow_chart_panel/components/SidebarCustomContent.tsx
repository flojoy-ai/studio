import { Anchor, createStyles, Flex } from "@mantine/core";

const useStyles = createStyles((theme) => {
  return {
    container: {
      borderBottom: `1px solid ${theme.colors.gray[5]}`,
    },
    reqBtn: {
      border: `2px solid ${theme.colors.accent1[0]}`,
      background: "transparent",
      borderRadius: "2px",
      alignSelf: "center",
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
  onAddNode: (key: string) => void;
};

const SidebarCustomContent = ({ onAddNode }: SidebarCustomContentProps) => {
  const { classes } = useStyles();
  return (
    <Flex
      justify={"space-around"}
      align={"center"}
      py={4}
      className={classes.container}
    >
      <RequestNode classes={classes} />
      <EndNode classes={classes} onAddNode={onAddNode} />
    </Flex>
  );
};

const RequestNode = ({ classes }: { classes: Record<string, string> }) => {
  return (
    <button className={classes.reqBtn} data-testid="request-node-btn">
      <Anchor
        style={{
          textDecoration: "none",
        }}
        href="https://toqo276pj36.typeform.com/to/F5rSHVu1"
        target="_blank"
      >
        <span className={classes.span}>Request a Node</span>
      </Anchor>
    </button>
  );
};
type EndNodeProps = {
  classes: Record<string, string>;
  onAddNode: (key: string) => void;
};

const EndNode = ({ classes, onAddNode }: EndNodeProps) => {
  const cmdKey = "END";
  return (
    <button
      data-testid="end-node-btn"
      className={classes.endNode}
      onClick={() => {
        onAddNode(cmdKey);
      }}
    >
      {cmdKey}
    </button>
  );
};

export default SidebarCustomContent;
