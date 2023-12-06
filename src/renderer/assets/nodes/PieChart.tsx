import { memo, SVGProps } from "react";

const PieChart = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      viewBox="0 0 125 126"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.5 6C0.5 2.96244 2.96243 0.5 6 0.5H119C122.038 0.5 124.5 2.96243 124.5 6V119.796C124.5 122.834 122.038 125.296 119 125.296H6C2.96243 125.296 0.5 122.834 0.5 119.796V6Z"
        className="fill-accent2 stroke-accent2"
        fillOpacity="0.05"
      />
      <g clipPath="url(#clip0_5_198)">
        <path
          d="M64.1034 45.7897L64.3298 76.8221L34.062 68.7809C33.3389 71.4381 32.9554 74.2408 32.9805 77.1258C33.1063 94.3027 47.1839 108.127 64.4304 108C64.4744 108 64.5121 108 64.5561 108C81.5511 107.513 95.1195 93.6321 95 76.6702C94.8805 59.7084 81.1047 46.0301 64.1034 45.7897Z"
          className="fill-accent2"
        />
        <g opacity="0.5">
          <path
            d="M31 64.9532L61.2615 73.121L61.0352 42C46.6432 42.1076 34.5964 51.819 31 64.9532Z"
            className="fill-accent2"
          />
        </g>
      </g>
      <path
        d="M54.0606 28.7402H54.7579C55.4096 28.7402 55.8972 28.6126 56.2208 28.3574C56.5443 28.0976 56.7061 27.7217 56.7061 27.2295C56.7061 26.7327 56.5694 26.3659 56.2959 26.1289C56.0271 25.8919 55.6032 25.7734 55.0245 25.7734H54.0606V28.7402ZM58.8458 27.1543C58.8458 28.2298 58.5085 29.0524 57.834 29.6221C57.1641 30.1917 56.2094 30.4765 54.9698 30.4765H54.0606V34.0312H51.9415V24.0371H55.1338C56.3461 24.0371 57.2667 24.2991 57.8956 24.8232C58.529 25.3428 58.8458 26.1198 58.8458 27.1543ZM61.7125 34.0312V24.0371H63.8316V34.0312H61.7125ZM73.0831 34.0312H67.3272V24.0371H73.0831V25.7734H69.4464V27.9678H72.8302V29.7041H69.4464V32.2812H73.0831V34.0312Z"
        className="fill-accent2"
      />
      <defs>
        <clipPath id="clip0_5_198">
          <rect
            width="64"
            height="66"
            fill="white"
            transform="translate(31 42)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default memo(PieChart);
