import { MediaQuery, clsx, createStyles } from "@mantine/core";
import { Link } from "react-router-dom";
import { AppTab } from "./Header";

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
};

const HeaderTab = ({ to, children, testId }: TabButtonProps) => {
  const { classes } = useStyles();
  const active = location.pathname === to;

  return (
    <MediaQuery smallerThan={700} styles={{ minHeight: 55 }}>
      <Link
        to={to}
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
