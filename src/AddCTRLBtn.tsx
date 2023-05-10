import { createStyles } from "@mantine/core";

const useAddButtonStyle = createStyles((theme) => {
  return {
    addButton: {
      boxSizing: "border-box",
      background: theme.colorScheme === "dark" ? "#243438" : "#F6F7F8",
      border:
        theme.colorScheme === "dark"
          ? "1px solid #94F4FC"
          : "1px solid #E1E4E7",
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
      data-testid="add-node-button"
      className={classes.addButton}
      onClick={() => {
        setCTRLSideBarStatus(!isCTRLSideBarOpen);
        setIsEditMode(true);
      }}
      style={{
        width: "104px",
        height: "43px",
        left: "0px",
        top: "110px",
        margin: "10px",
        zIndex: 1,
      }}
    >
      + Add CTRL
    </button>
  );
};
