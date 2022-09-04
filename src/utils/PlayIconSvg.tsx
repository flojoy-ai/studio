import React from "react";

const PlayIconSvg = ({ style, theme }: {theme:string, style?: Record<string, any> }) => {
  return (
    <svg
      style={style}
      width="9"
      height="11"
      viewBox="0 0 9 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.5 4.63397C9.16667 5.01887 9.16667 5.98113 8.5 6.36603L1.75 10.2631C1.08333 10.648 0.25 10.1669 0.25 9.39711L0.25 1.60289C0.25 0.833085 1.08333 0.35196 1.75 0.73686L8.5 4.63397Z"
        fill={theme === 'dark' ? "#99F5FF" : 'rgba(123, 97, 255, 1)'}
      />
    </svg>
  );
};

export default PlayIconSvg;
