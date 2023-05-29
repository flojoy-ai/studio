import { Button, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => {
  const accent =
    theme.colorScheme === "dark" ? theme.colors.accent1 : theme.colors.accent2;
  return {
    button: {
      width: "fit-content",
      height: "43px",
      margin: "10px",
      boxSizing: "border-box",
      backgroundColor: theme.colors.accent4[1],
      color: theme.colors.accent4[0],
      border: `1px solid ${theme.colors.accent4[0]}`,
      cursor: "pointer",
      zIndex: 100,
      fontWeight: 600,
      "&:hover": {
        backgroundColor: accent[1] + "36",
      },
    },
  };
});

export const AddCTRLBtn = ({
  setCTRLSideBarStatus,
  setIsEditMode,
  isCTRLSideBarOpen,
}: {
  setCTRLSideBarStatus: (value: React.SetStateAction<boolean>) => void;
  setIsEditMode: (value: React.SetStateAction<boolean>) => void;
  isCTRLSideBarOpen: boolean;
}) => {
  const { classes } = useStyles();
  return (
    <Button
      data-testid="add-ctrl-button"
      data-cy="add-ctrl"
      className={classes.button}
      onClick={() => {
        setCTRLSideBarStatus(!isCTRLSideBarOpen);
        setIsEditMode(true);
      }}
    >
      + Add CTRL
    </Button>
  );
};
