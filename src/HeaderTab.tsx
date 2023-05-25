import { MediaQuery, clsx, createStyles } from "@mantine/core";
import { Link } from "react-router-dom";
import { sendTabChangedToMix } from "@src/services/MixpanelServices";

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
  //if the destination is '/', tab is PROGRAM, else it's just the upper case without '/'
  const tab = to === "/" ? "PROGRAM" : to.replace("/", "").toUpperCase();

  return (
    <MediaQuery smallerThan={700} styles={{ minHeight: 55 }}>
      <Link
        to={to}
        onClick={() => {
          /*SendTabChangedToMix(tab)}*/
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
