import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => {
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

export const AddNodeBtn = ({ setSCRIPTSideBarStatus, isSCRIPTSideBarOpen }) => {
  const { classes } = useStyles();
  return (
    <button
      data-testid="add-node-button"
      className={classes.addButton}
      onClick={() => setSCRIPTSideBarStatus(!isSCRIPTSideBarOpen)}
      style={{
        position: "absolute",
        width: "104px",
        height: "43px",
        left: "0px",
        top: "110px",
        margin: "10px",
        zIndex: 1,
      }}
    >
      + Add Node
    </button>
  );
};
