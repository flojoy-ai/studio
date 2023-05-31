import { Box, Header as MantineHeader, createStyles } from "@mantine/core";
import { memo } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import HeaderTab from "./HeaderTab";
import { Logo } from "./Logo";
import ControlBar from "./feature/flow_chart_panel/views/ControlBar";

const useStyles = createStyles(() => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0 10px",
  },
  tabs: {
    display: "flex",
    height: "100%",
    gap: 32,
    alignItems: "center",
  },
  controlButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

export type AppTab = "visual" | "panel" | "debug";

const Header = () => {
  const { classes } = useStyles();

  return (
    <MantineHeader height="70px" className={classes.header}>
      <Box className={classes.tabs}>
        <Logo />
        <HeaderTab to={"/"} testId="script-btn">
          Visual Python Script
        </HeaderTab>
        <HeaderTab to={"/controls"} testId="ctrls-btn">
          Ctrl Panel
        </HeaderTab>
        <HeaderTab to={"/debug"} testId="debug-btn">
          Debug
        </HeaderTab>
      </Box>
      <Box className={classes.controlButtons}>
        <ControlBar />
        <DarkModeToggle />
      </Box>
    </MantineHeader>
  );
};

export default memo(Header);
