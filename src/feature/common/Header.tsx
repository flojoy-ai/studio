import {
  Box,
  Header as MantineHeader,
  createStyles,
  getBreakpointValue,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { memo } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import HeaderTab from "./HeaderTab";
import { Logo } from "./Logo";
import ControlBar from "../flow_chart_panel/views/ControlBar";
import useKeyboardShortcut from "../../hooks/useKeyboardShortcut";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "react-use";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0 10px",
  },

  tabs: {
    display: "flex",
    height: "100%",
    gap: 8,
    [theme.fn.largerThan("sm")]: {
      gap: 16,
    },
    [theme.fn.largerThan("md")]: {
      gap: 32,
    },
    alignItems: "center",
  },

  controlButtons: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

const tabs = [
  {
    to: "/",
    fullText: "Visual Python Script",
    shortText: "Script",
    testId: "script-btn",
  },
  {
    to: "/controls",
    fullText: "Ctrl Panel",
    shortText: "Ctrl",
    testId: "ctrls-btn",
  },
  {
    to: "/debug",
    fullText: "Debug",
    shortText: "Debug",
    testId: "debug-btn",
  },
];

const Header = () => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const navigate = useNavigate();

  useKeyboardShortcut("shift", "C", () => {
    navigate("/controls");
  });
  useKeyboardShortcut("shift", "B", () => {
    navigate("/debug");
  });
  useKeyboardShortcut("shift", "S", () => {
    navigate("/");
  });

  // Actual media query causes flickering... need to use this manual one
  const { width } = useWindowSize();
  const large = width > getBreakpointValue(theme.breakpoints.sm);

  return (
    <MantineHeader height="70px" className={classes.header}>
      <Box className={classes.tabs}>
        <Logo />
        {tabs.map((t) => (
          <HeaderTab to={t.to} testId={t.testId} key={t.fullText}>
            {large ? t.fullText : t.shortText}
          </HeaderTab>
        ))}
      </Box>
      <Box className={classes.controlButtons}>
        <ControlBar />
        <DarkModeToggle />
      </Box>
    </MantineHeader>
  );
};

export default memo(Header);
