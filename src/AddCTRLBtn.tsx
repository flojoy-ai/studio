import { createStyles } from "@mantine/core";

const useAddButtonStyle = createStyles((theme) => {
  return {
    addButton: {
      boxSizing: "border-box",
      backgroundColor: theme.colors.accent4[1],
      color: theme.colors.accent4[0],
      border: `1px solid ${theme.colors.accent4[0]}`,
      cursor: "pointer",
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
  const { classes } = useAddButtonStyle();
  return (
    <button
      data-testid="add-ctrl-button"
      data-cy="add-ctrl"
      className={classes.addButton}
      onClick={() => {
        setCTRLSideBarStatus(!isCTRLSideBarOpen);
        setIsEditMode(true);
      }}
      style={{
        width: "fit-content",
        height: "43px",
        left: "10px",
        top: "110px",
        margin: "10px",
        zIndex: 1,
      }}
    >
      + Add CTRL
    </button>
  );
};
