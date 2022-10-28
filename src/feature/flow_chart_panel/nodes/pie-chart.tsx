import React, { CSSProperties, Fragment } from "react";
interface SvgProps {
  style?: CSSProperties;
  theme?: "light" | "dark";
}
const PieChartIcon = ({ style }: SvgProps) => {
  return (
    <svg
      width="64"
      height="66"
      style={style}
      viewBox="0 0 64 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_5_252)">
        <path
          d="M33.1034 3.78969L33.3298 34.8221L3.06199 26.7809C2.33893 29.4381 1.9554 32.2408 1.98055 35.1258C2.1063 52.3027 16.1839 66.1265 33.4304 66C33.4744 66 33.5121 66 33.5561 66C50.5511 65.5129 64.1195 51.6321 64 34.6702C63.8805 17.7084 50.1047 4.0301 33.1034 3.78969Z"
          fill="#99F5FF"
        />
        <g opacity="0.5">
          <path
            d="M0 22.9532L30.2615 31.121L30.0352 0C15.6432 0.107554 3.59642 9.81902 0 22.9532Z"
            fill="#99F5FF"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_5_252">
          <rect width="64" height="66" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
const PieChartTitle = ({ style }: SvgProps) => (
  <svg
    width="23"
    height="11"
    style={style}
    viewBox="0 0 23 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.0606 4.74022H3.75786C4.40955 4.74022 4.89719 4.61261 5.22075 4.35741C5.54432 4.09764 5.7061 3.72166 5.7061 3.22948C5.7061 2.73273 5.56939 2.36587 5.29595 2.12889C5.02707 1.89191 4.60324 1.77342 4.02446 1.77342H3.0606V4.74022ZM7.84575 3.15428C7.84575 4.2298 7.50851 5.05239 6.83403 5.62206C6.16411 6.19172 5.20936 6.47655 3.96978 6.47655H3.0606V10.0312H0.941456V0.0370941H4.13384C5.34608 0.0370941 6.26665 0.299138 6.89556 0.823227C7.52902 1.34276 7.84575 2.11978 7.84575 3.15428ZM10.7125 10.0312V0.0370941H12.8316V10.0312H10.7125ZM22.0831 10.0312H16.3272V0.0370941H22.0831V1.77342H18.4464V3.96776H21.8302V5.70409H18.4464V8.28123H22.0831V10.0312Z"
      fill="#99F5FF"
    />
  </svg>
);

const PieChart = ({ theme }: SvgProps) => {
  return (
    <Fragment>
      <PieChartTitle
        style={{
          position: "absolute",
          bottom: 5,
          left: "50%",
          transform: "translateX(-50%)",
          height: 105,
        }}
      />
      <PieChartIcon
        theme={theme}
        style={{
          position: "absolute",
          top: 21,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
    </Fragment>
  );
};

export default PieChart;
