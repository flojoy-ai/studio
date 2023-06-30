import { MediaQuery, clsx, createStyles } from "@mantine/core";
import { Link } from "react-router-dom";
import { sendEventToMix } from "@src/services/MixpanelServices";
import { AppTab } from "@feature/common/Sidebar/Sidebar";

const useStyles = createStyles((theme) => ({
  tab: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    fontSize: "14px",
    lineHeight: 1.15,
    border: "none",
    cursor: "pointer",
    backgroundColor: "transparent",
    textDecoration: "none",
    color: theme.colors.title[0],
  },
  active: {
    borderBottom: `1px solid ${theme.colors.accent1[0]}`,
  },
}));

type TabButtonProps = {
  to: string;
  children?: React.ReactNode;
  testId?: string;
  appTab: AppTab;
};

const HeaderTab = ({ to, children, testId, appTab }: TabButtonProps) => {
  const { classes } = useStyles();
  const active = location.pathname === to;

  return (
    <MediaQuery smallerThan={700} styles={{ minHeight: 55 }}>
      <Link
        to={to}
        onClick={() => {
          sendEventToMix("Tab Changed", appTab, "Tab");
        }}
        className={clsx(classes.tab, active && classes.active)}
        color="dark"
        data-cy={testId}
      >
        {children}
      </Link>
    </MediaQuery>
  );
};

export default HeaderTab;
