import {
  Box,
  Header as MantineHeader,
  createStyles,
  useMantineColorScheme,
} from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import { Logo } from "./Logo";
import { HeaderTab } from "./HeaderTab";
import Controls from "./feature/flow_chart_panel/views/ControlBar";
import { useLocation } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 10px",
  },

  tabs: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    gap: "16px",
  },

  controlButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

export type AppTab = "visual" | "panel" | "debug";

export const Header = () => {
  const { classes } = useStyles();

  return (
    <MantineHeader height="80px" className={classes.header}>
      <Box className={classes.tabs}>
        <Logo />
        <HeaderTab to={"/"} testId="script-btn">
          SCRIPT
        </HeaderTab>
        <HeaderTab to={"/controls"} testId="ctrls-btn">
          CTRLS
        </HeaderTab>
        <HeaderTab to={"/debug"} testId="debug-btn">
          DEBUG
        </HeaderTab>
      </Box>
      <Box className={classes.controlButtons}>
        <Controls />
        <DarkModeToggle />
      </Box>
    </MantineHeader>
  );
};
