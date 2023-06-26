import { CSSProperties } from "react";

interface SvgProps {
  style?: CSSProperties;
  theme?: "light" | "dark";
}

export const BGTemplate = ({ style, theme }: SvgProps) => {
  if (theme === "light") {
    return (
      <svg
        data-testid="default-svg"
        style={style}
        width="249"
        height="158"
        viewBox="0 0 249 158"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.05078 0.5H242.971C246.008 0.5 248.471 2.96243 248.471 6V151.88C248.471 154.917 246.008 157.38 242.971 157.38H6.05077C3.01321 157.38 0.550781 154.917 0.550781 151.88V5.99999C0.550781 2.96243 3.01321 0.5 6.05078 0.5Z"
          fill="#7B61FF"
          fillOpacity="0.17"
          strokeWidth={"3"}
          stopOpacity={"0.8"}
          stroke="#7B61FF"
        />
      </svg>
    );
  }
  return (
    <svg
      data-testid="default-svg"
      style={style}
      width="250"
      height="159"
      viewBox="0 0 250 159"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.88501 6C0.88501 2.96243 3.34744 0.5 6.38501 0.5H243.882C246.92 0.5 249.382 2.96243 249.382 6V152.246C249.382 155.284 246.92 157.746 243.882 157.746H6.385C3.34744 157.746 0.88501 155.284 0.88501 152.246V6Z"
        fill="#99F5FF"
        strokeWidth={"3"}
        stopOpacity={"0.8"}
        fillOpacity="0.2"
        stroke="#99F5FF"
      />
    </svg>
  );
};
