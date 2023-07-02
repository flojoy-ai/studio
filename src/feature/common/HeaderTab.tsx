import { MediaQuery, clsx, createStyles } from "@mantine/core";
import { Link } from "react-router-dom";

const useStyles = createStyles((theme) => {
  const accent = theme.colors.accent1;
  return {
    tab: {
      display: "inline-block",
      padding: "24px 0px",
      alignItems: "center",
      cursor: "pointer",
      backgroundColor: "transparent",

      fontSize: "14px",
      letterSpacing: "1px",
      lineHeight: 1.15,
      textDecoration: "none",
      color: theme.colors.title[0],
      fontFamily: "Open Sans",
      fontWeight: 600,
      textTransform: "uppercase",
    },
    hoverEffect: {
      "&:after": {
        display: "block",
        content: "''",
        borderBottom: `2px solid ${accent[0]}`,
        transform: "scaleX(0) translateY(24px)", // A bit hacky CSS, should probably find a better way
        transition: "transform 250ms ease-in-out",
      },
      "&:hover": {
        "&:after": {
          transform: "scaleX(1) translateY(24px)",
        },
      },
    },
    active: {
      borderBottom: `2px solid ${accent[0]}`,
    },
  };
});

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
        className={clsx(
          classes.tab,
          active ? classes.active : classes.hoverEffect
        )}
        color="dark"
        data-cy={testId}
      >
        {children}
      </Link>
    </MediaQuery>
  );
};

export default HeaderTab;
