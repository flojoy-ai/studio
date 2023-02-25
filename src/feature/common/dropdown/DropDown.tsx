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
    console.log("openDropDown: ",DropDownElem.current);
    if (DropDownElem.current) {
      DropDownElem.current.style.opacity = "1";
      DropDownElem.current.style.zIndex = "50";
      DropDownElem.current.style.transform = "translateY(0)";
    }
  };
  const closeDropDown = () => {
    console.log("closeDropDown: ",DropDownElem.current);
    if (DropDownElem.current) {
      DropDownElem.current.style.opacity = "0";
      DropDownElem.current.style.zIndex = "-1";
      DropDownElem.current.style.transform = "translateY(-10%)";
    }
  };
  return (
    <div
      className="dropdown__wrapper"
      onMouseEnter={openDropDown}
      onMouseLeave={closeDropDown}
    >
      {DropDownBtn}
      <div
        className={`dropdown__container ${theme === "dark" ? "dark" : "light"}`}
        ref={DropDownElem}
        onMouseLeave={closeDropDown}
      >
        {children}
      </div>
    </div>
  );
};

export default DropDown;
