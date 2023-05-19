import { MediaQuery, clsx, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  button: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    fontSize: "14px",
    lineHeight: 1.15,
    border: "none",
    cursor: "pointer",
    backgroundColor: "transparent",
  },
  active: {
    borderBottom: `1px solid ${theme.colors.accent1[0]}`,
  },
}));

type TabButtonProps = {
  onClick: () => void;
  active: boolean;
  children?: React.ReactNode;
  testId?: string;
};

export const TabButton = ({
  onClick,
  active,
  children,
  testId,
}: TabButtonProps) => {
  const { classes } = useStyles();

  return (
    <MediaQuery smallerThan={700} styles={{ minHeight: 55 }}>
      <button
        onClick={onClick}
        className={clsx(classes.button, active && classes.active)}
        color="dark"
        data-cy={testId}
      >
        {children}
      </button>
    </MediaQuery>
  );
};
