import { Box, Header as MantineHeader, createStyles } from "@mantine/core";
import { memo } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import HeaderTab from "./HeaderTab";
import { Logo } from "./Logo";
import ControlBar from "./feature/flow_chart_panel/views/ControlBar";
import useKeyboardShortcut from "./hooks/useKeyboardShortcut";
import { useNavigate } from "react-router-dom";

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
    alignItems: "center",
    gap: "16px",
  },

  controlButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

export type AppTab = "visual" | "panel" | "debug";

const Header = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const ctrlsShortCut = () => {
    navigate('/controls');
  };

  const debugShortCut = () => {
    navigate('/debug')
  };

  const mainShortCut = () => {
    navigate('/')
  };

  useKeyboardShortcut("shift", "C", () => ctrlsShortCut());
  useKeyboardShortcut("shift", "B", () => debugShortCut());
  useKeyboardShortcut("shift", "S", () => mainShortCut());

  return (
    <MantineHeader height="70px" className={classes.header}>
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
        <ControlBar />
        <DarkModeToggle />
      </Box>
    </MantineHeader>
  );
};

export default memo(Header);
