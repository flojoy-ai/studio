import { Box, createStyles } from "@mantine/core";
import React, { useRef } from "react";

const useStyles = createStyles((theme) => {
  return {
    dropdownWrapper: {
      position: "relative",
    },
    dropdownContainer: {
      paddingTop: 15,
      paddingBottom: 15,
      paddingLeft: 7,
      paddingRight: 7,
      borderRadius: 15,
      transition: "all ease 0.5s",
      flexDirection: "column",
      position: "absolute",
      top: "52px",
      right: 0,
      width: "fit-content",
      alignItems: "flex-start",
      zIndex: -1,
      transform: "translateY(-10%)",
      opacity: 0,
      backgroundColor: theme.colorScheme === "light" ? "#FFFFFF" : "#111111",
      boxShadow: theme.colorScheme === "light" ? theme.shadows.sm : "none",
      "> button": {
        padding: "8px 12px",
        marginRight: "10px",
        cursor: "pointer",
        borderRadius: 2,
        fontSize: "14px",
        fontWeight: "bold",
        textDecoration: "none",
        background: theme.colorScheme === "light" ? "#FFFFFF" : "#111111",
        border: "none",
        width: "100%",
        textAlign: "start",
        whiteSpace: "nowrap",
        color:
          theme.colorScheme === "dark" ? "#FFFFFF" : "#111111",
      },
      "> button:not(.disabled):hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? "#1C1B1F"
            : "#F4F4F4",
      },
    },
  };
});

interface DropDownProps {
  children: React.ReactNode;
  dropDownBtn: React.ReactNode;
}

const DropDown = ({ children, dropDownBtn }: DropDownProps) => {
  const { classes } = useStyles();

  const DropDownElem = useRef<HTMLDivElement>(null);
  const openDropDown = () => {
    if (DropDownElem.current) {
      DropDownElem.current.style.opacity = "1";
      DropDownElem.current.style.zIndex = "50";
      DropDownElem.current.style.transform = "translateY(0)";
    }
  };
  const closeDropDown = () => {
    if (DropDownElem.current) {
      DropDownElem.current.style.opacity = "0";
      DropDownElem.current.style.zIndex = "-1";
      DropDownElem.current.style.transform = "translateY(-10%)";
    }
  };
  return (
    <Box
      data-cy="dropdown-wrapper"
      data-testid="dropdown-wrapper"
      className={classes.dropdownWrapper}
      onMouseEnter={openDropDown}
      onMouseLeave={closeDropDown}
    >
      {dropDownBtn}
      <Box
        data-testid="dropdown-container"
        className={classes.dropdownContainer}
        ref={DropDownElem}
        onMouseLeave={closeDropDown}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DropDown;
