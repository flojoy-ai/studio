import { Text, createStyles } from "@mantine/core";
import { IServerStatus } from "./context/socket.context";

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

export const ServerStatus = ({ serverStatus }: ServerStatusProps) => {
  const { classes } = useStyles();
  return (
    <Text data-cy="app-status" className={classes.status}>
      <code>{serverStatus}</code>
    </Text>
  );
};
