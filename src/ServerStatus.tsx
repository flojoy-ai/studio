import { Text, createStyles } from "@mantine/core";
import { IServerStatus } from "./context/socket.context";
import React from "react";

const useStyles = createStyles((theme) => ({
  status: {
    backgroundColor: theme.colorScheme === "dark" ? "#14131361" : "#58454517",
    textAlign: "center",
    fontSize: "14px",
    padding: "4px 0px",
  },
}));

type ServerStatusProps = {
  serverStatus: IServerStatus;
};

const ServerStatus = ({ serverStatus }: ServerStatusProps) => {
  const { classes } = useStyles();
  return (
    <Text data-cy="app-status" className={classes.status}>
      <code>{serverStatus}</code>
    </Text>
  );
};

export default React.memo(ServerStatus);
