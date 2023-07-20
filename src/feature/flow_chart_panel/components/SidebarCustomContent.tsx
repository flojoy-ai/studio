import { Anchor, Button, createStyles, Flex } from "@mantine/core";
import { REQUEST_NODE_URL } from "@src/data/constants";

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
  };
});

const SidebarCustomContent = () => {
  const { classes } = useStyles();
  return (
    <Flex
      justify={"space-around"}
      align={"center"}
      py={8}
      className={classes.container}
    >
      <RequestNode classes={classes} />
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
        href={REQUEST_NODE_URL}
        target="_blank"
      >
        <span className={classes.span}>Request a Node</span>
      </Anchor>
    </Button>
  );
};

export default SidebarCustomContent;
