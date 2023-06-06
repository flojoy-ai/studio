import { Box, createStyles } from "@mantine/core";
import React, { useRef } from "react";

const useStyles = createStyles((theme) => {
  return {
    dropdownWrapper: {
      position: "relative",
    },
    dropdownContainer: {
      padding: "15px 7px",
      borderRadius: 15,
      transition: "all ease 0.4s",
      flexDirection: "column",
      position: "absolute",
      top: "52px",
      right: 0,
      width: "fit-content",
      alignItems: "flex-start",
      zIndex: -1,
      transform: "translateY(-10%)",
      opacity: 0,
      backgroundColor: theme.colors.modal[1],
      boxShadow: theme.colorScheme === "light" ? theme.shadows.sm : "none",
      "> button": {
        padding: "8px 12px",
        marginRight: "10px",
        borderRadius: 2,
        fontSize: "14px",
        fontWeight: "bold",
        textDecoration: "none",
        background: theme.colors.modal[1],
        border: "none",
        width: "100%",
        textAlign: "start",
        whiteSpace: "nowrap",
        cursor: "pointer",
        color: theme.colors.title[0],
      },
      "> button.disabled": {
        cursor: "not-allowed",
        opacity: 0.5,
      },
      "> button:not(.disabled):hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.modal[0],
      },
    },
  };
});

interface DropdownProps {
  children: React.ReactNode;
  dropdownBtn: React.ReactNode;
}

const Dropdown = ({ children, dropdownBtn }: DropdownProps) => {
  const { classes } = useStyles();
  const DropdownElem = useRef<HTMLDivElement>(null);
  const openDropDown = () => {
    if (DropdownElem.current) {
      DropdownElem.current.style.opacity = "1";
      DropdownElem.current.style.zIndex = "50";
      DropdownElem.current.style.transform = "translateY(0)";
    }
  };
  const closeDropDown = () => {
    if (DropdownElem.current) {
      DropdownElem.current.style.opacity = "0";
      DropdownElem.current.style.zIndex = "-1";
      DropdownElem.current.style.transform = "translateY(-10%)";
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
      {dropdownBtn}
      <Box
        data-testid="dropdown-container"
        className={classes.dropdownContainer}
        ref={DropdownElem}
        onMouseLeave={closeDropDown}
      >
        {children}
      </Box>
    </Box>
  );
};
export default Dropdown;
