import React, { useRef } from "react";
import "@src/feature/common/dropdown/dropdown.css";

interface DropDownProps {
  children: React.ReactNode;
  DropDownBtn: React.ReactNode;
  theme: "light" | "dark";
}
const DropDown = ({ children, DropDownBtn, theme }: DropDownProps) => {
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
    <div
      data-testid="dropdown-wrapper"
      className="dropdown__wrapper"
      onMouseEnter={openDropDown}
      onMouseLeave={closeDropDown}
    >
      {DropDownBtn}
      <div
        data-testid="dropdown-container"
        className={`dropdown__container ${theme}`}
        ref={DropDownElem}
        onMouseLeave={closeDropDown}
      >
        {children}
      </div>
    </div>
  );
};

export default DropDown;
