import { Text, createStyles } from "@mantine/core";
import { IServerStatus } from "./context/socket.context";
import { memo } from "react";

const useStyles = createStyles((theme) => ({
  status: {
    backgroundColor: theme.colorScheme === "dark" ? "#14131361" : "#58454517",
    fontSize: "14px",
    minHeight: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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

export default memo(ServerStatus);
