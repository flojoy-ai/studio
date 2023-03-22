import React, { useRef } from "react";
import "@src/feature/flow_chart_panel/components/play-btn/play-btn.css";

interface PlayBtnProps {
  theme: "light" | "dark";
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const PlayBtn = ({ theme, onClick, style, disabled = false }: PlayBtnProps) => {
  const ButtonElem = useRef<HTMLButtonElement>(null);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (ButtonElem.current) {
      ButtonElem.current.classList.add("animate");
      //reset animation
      setTimeout(() => {
        ButtonElem.current?.classList.remove("animate");
      }, 1000);
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`btn__play ${theme}`}
      ref={ButtonElem}
      style={style}
      onClick={handleClick}
      data-cy="btn-play"
      data-testid="btn-play"
      disabled={disabled}
      title={disabled ? "Server is offline" : "Run Script"}
    >
      <svg
        width="9"
        height="11"
        viewBox="0 0 9 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.5 4.63397C9.16667 5.01887 9.16667 5.98113 8.5 6.36603L1.75 10.2631C1.08333 10.648 0.25 10.1669 0.25 9.39711L0.25 1.60289C0.25 0.833085 1.08333 0.35196 1.75 0.73686L8.5 4.63397Z"
          fill={theme === "dark" ? "#99F5FF" : "rgba(123, 97, 255, 1)"}
        />
      </svg>
      <span>Play</span>
    </button>
  );
};

export default PlayBtn;
