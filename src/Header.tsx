import {
  Box,
  Header as MantineHeader,
  createStyles,
  useMantineColorScheme,
} from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import { Logo } from "./Logo";
import { TabButton } from "./TabButton";
import Controls from "./feature/flow_chart_panel/views/ControlBar";

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

type HeaderProps = {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  setOpenCtrlModal: Dispatch<SetStateAction<boolean>>;
};

export const Header = ({
  currentTab,
  setCurrentTab,
  setOpenCtrlModal,
}: HeaderProps) => {
  const { classes } = useStyles();

  return (
    <MantineHeader height="80px" className={classes.header}>
      <Box className={classes.tabs}>
        <Logo />
        <TabButton
          onClick={() => setCurrentTab("visual")}
          active={currentTab === "visual"}
          testId="script-btn"
        >
          SCRIPT
        </TabButton>
        <TabButton
          onClick={() => setCurrentTab("panel")}
          active={currentTab === "panel"}
          testId="ctrls-btn"
        >
          CTRLS
        </TabButton>
        <TabButton
          onClick={() => setCurrentTab("debug")}
          active={currentTab === "debug"}
          testId="debug-btn"
        >
          DEBUG
        </TabButton>
      </Box>
      <Box className={classes.controlButtons}>
        <Controls activeTab={currentTab} setOpenCtrlModal={setOpenCtrlModal} />
        <DarkModeToggle />
      </Box>
    </MantineHeader>
  );
};
