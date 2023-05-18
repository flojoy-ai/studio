import { useMantineTheme } from "@mantine/core";

const BarChart = () => {
  const theme = useMantineTheme();
  if (theme.colorScheme === "dark") {
    return <BarChartDark />;
  }

  return <BarChartLight />;
};

const BarChartDark = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="225"
      height="226"
      viewBox="0 0 225 226"
    >
      <rect width="100%" height="100%" fill="rgba(255, 255, 255, 0)"></rect>
      <path
        stroke="#000"
        strokeWidth="2"
        d="M0 0L0 0"
        transform="translate(31.5 79.5)"
        vectorEffect="non-scaling-stroke"
      ></path>
      <path
        stroke="#000"
        strokeWidth="2"
        d="M0 0L0 0"
        transform="translate(157.5 180.5)"
        vectorEffect="non-scaling-stroke"
      ></path>
      <path
        fill="#99F5FF"
        fillOpacity="0.2"
        strokeWidth={"3"}
        stopOpacity={"0.8"}
        stroke="#99F5FF"
        d="M-59.811-54.69a5.5 5.5 0 015.5-5.5H54.307a5.5 5.5 0 015.5 5.5V54.697a5.5 5.5 0 01-5.5 5.5H-54.311a5.5 5.5 0 01-5.5-5.5V-54.69z"
        transform="matrix(1.86 0 0 1.86 112.38 113.38) translate(.15 -.31)"
      ></path>
      <g
        clipPath="url(#CLIPPATH_168)"
        transform="matrix(1.86 0 0 1.86 112.38 113.38) translate(-33.9 35.82)"
      >
        <clipPath id="CLIPPATH_168">
          <rect
            width="78.161"
            height="56.932"
            x="-39.08"
            y="-28.466"
            rx="0"
            ry="0"
            transform="translate(34.05 -21.07)"
          ></rect>
        </clipPath>
        <path fill="#99F5FF" d="M5.023-7.319H-5.032V7.316H5.023V-7.319z"></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_169)"
        transform="matrix(1.86 0 0 1.86 112.38 113.38) translate(-20.26 14.69)"
      >
        <clipPath id="CLIPPATH_169">
          <rect
            width="78.161"
            height="56.932"
            x="-39.08"
            y="-28.466"
            rx="0"
            ry="0"
            transform="translate(20.4 .06)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M5.033-28.407H-5.023v56.805H5.033v-56.805z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_170)"
        transform="matrix(1.86 0 0 1.86 112.38 113.38) translate(-6.61 29.69)"
      >
        <clipPath id="CLIPPATH_170">
          <rect
            width="78.161"
            height="56.932"
            x="-39.08"
            y="-28.466"
            rx="0"
            ry="0"
            transform="translate(6.75 -14.94)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M5.033-13.386H-5.023v26.775H5.033v-26.775z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_171)"
        transform="matrix(1.86 0 0 1.86 112.38 113.38) translate(7.04 40.08)"
      >
        <clipPath id="CLIPPATH_171">
          <rect
            width="78.161"
            height="56.932"
            x="-39.08"
            y="-28.466"
            rx="0"
            ry="0"
            transform="translate(-6.9 -25.33)"
          ></rect>
        </clipPath>
        <path fill="#99F5FF" d="M5.032-3.131H-5.024v6.262H5.032v-6.262z"></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_172)"
        transform="matrix(1.86 0 0 1.86 112.38 113.38) translate(20.69 35.84)"
      >
        <clipPath id="CLIPPATH_172">
          <rect
            width="78.161"
            height="56.932"
            x="-39.08"
            y="-28.466"
            rx="0"
            ry="0"
            transform="translate(-20.55 -21.09)"
          ></rect>
        </clipPath>
        <path fill="#99F5FF" d="M5.031-7.339H-5.025V7.342H5.031v-14.68z"></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_173)"
        transform="matrix(1.86 0 0 1.86 112.38 113.38) translate(34.34 26.55)"
      >
        <clipPath id="CLIPPATH_173">
          <rect
            width="78.161"
            height="56.932"
            x="-39.08"
            y="-28.466"
            rx="0"
            ry="0"
            transform="translate(-34.2 -11.8)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M5.031-16.524H-5.025v33.05H5.031v-33.05z"
        ></path>
      </g>
      <path
        fill="#99F5FF"
        d="M-14.504-4.975h3.11c1.417 0 2.445.203 3.083.608.643.401.964 1.042.964 1.921 0 .597-.141 1.087-.424 1.47-.278.383-.65.613-1.114.69v.069c.633.141 1.089.405 1.367.793.283.387.424.902.424 1.545 0 .911-.33 1.622-.991 2.133-.657.51-1.55.765-2.68.765h-3.74v-9.994zm2.119 3.958h1.23c.574 0 .99-.089 1.244-.267.26-.177.39-.471.39-.881 0-.383-.141-.657-.424-.82-.278-.17-.72-.254-1.326-.254h-1.114v2.222zm0 1.682v2.604h1.38c.584 0 1.015-.112 1.293-.335.278-.223.417-.565.417-1.025 0-.83-.593-1.244-1.778-1.244h-1.312zM2 5.019L1.276 2.64h-3.644l-.725 2.38h-2.283l3.527-10.036H.742L4.283 5.019H2zM.77.863A1991.72 1991.72 0 01-.365-2.794a11.472 11.472 0 01-.178-.67c-.15.583-.58 2.025-1.292 4.327H.77zM8.647-.538h.684c.67 0 1.164-.112 1.483-.335.32-.224.479-.575.479-1.053 0-.474-.164-.811-.493-1.012-.323-.2-.827-.3-1.51-.3h-.643v2.7zm0 1.722V5.02H6.528v-9.994H9.44c1.358 0 2.363.248 3.015.745.651.492.977 1.242.977 2.25 0 .587-.162 1.111-.485 1.571-.324.456-.782.814-1.374 1.074a403.195 403.195 0 002.94 4.354H12.16L9.775 1.184H8.647z"
        transform="matrix(1.86 0 0 1.86 112.38 113.38) translate(.58 -33.69)"
      ></path>
    </svg>
  );
};

const BarChartLight = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="225"
      height="226"
      viewBox="0 0 225 226"
    >
      <rect width="100%" height="100%" fill="rgba(255, 255, 255, 0)"></rect>
      <path
        stroke="#000"
        strokeWidth="2"
        d="M0 0L0 0"
        transform="translate(31.5 79.5)"
        vectorEffect="non-scaling-stroke"
      ></path>
      <path
        stroke="#000"
        strokeWidth="2"
        d="M0 0L0 0"
        transform="translate(157.5 180.5)"
        vectorEffect="non-scaling-stroke"
      ></path>
      <path
        fill="#7B61FF"
        fillOpacity="0.2"
        strokeWidth={"3"}
        stopOpacity={"0.8"}
        stroke="#7B61FF"
        d="M-59.73-54.61a5.5 5.5 0 015.5-5.5H54.23a5.5 5.5 0 015.5 5.5V54.617a5.5 5.5 0 01-5.5 5.5H-54.23a5.5 5.5 0 01-5.5-5.5V-54.61z"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(-.27 -.39)"
      ></path>
      <g
        clipPath="url(#CLIPPATH_161)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(-34.28 35.69)"
      >
        <clipPath id="CLIPPATH_161">
          <rect
            width="78.058"
            height="56.857"
            x="-39.029"
            y="-28.429"
            rx="0"
            ry="0"
            transform="translate(34.01 -21.04)"
          ></rect>
        </clipPath>
        <path fill="#7B61FF" d="M5.024-7.306H-5.02V7.31H5.024V-7.306z"></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_162)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(-20.65 14.59)"
      >
        <clipPath id="CLIPPATH_162">
          <rect
            width="78.058"
            height="56.857"
            x="-39.029"
            y="-28.429"
            rx="0"
            ry="0"
            transform="translate(20.38 .06)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M5.025-28.37H-5.017v56.732H5.025v-56.731z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_163)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(-7.01 29.57)"
      >
        <clipPath id="CLIPPATH_163">
          <rect
            width="78.058"
            height="56.857"
            x="-39.029"
            y="-28.429"
            rx="0"
            ry="0"
            transform="translate(6.74 -14.92)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M5.017-13.368H-5.026v26.741H5.017v-26.74z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_164)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(6.62 39.95)"
      >
        <clipPath id="CLIPPATH_164">
          <rect
            width="78.058"
            height="56.857"
            x="-39.029"
            y="-28.429"
            rx="0"
            ry="0"
            transform="translate(-6.89 -25.3)"
          ></rect>
        </clipPath>
        <path fill="#7B61FF" d="M5.018-3.13H-5.024v6.254H5.018V-3.13z"></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_165)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(20.25 35.71)"
      >
        <clipPath id="CLIPPATH_165">
          <rect
            width="78.058"
            height="56.857"
            x="-39.029"
            y="-28.429"
            rx="0"
            ry="0"
            transform="translate(-20.52 -21.07)"
          ></rect>
        </clipPath>
        <path fill="#7B61FF" d="M5.02-7.326H-5.023V7.335H5.02V-7.326z"></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_166)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(33.88 26.44)"
      >
        <clipPath id="CLIPPATH_166">
          <rect
            width="78.058"
            height="56.857"
            x="-39.029"
            y="-28.429"
            rx="0"
            ry="0"
            transform="translate(-34.15 -11.79)"
          ></rect>
        </clipPath>
        <path fill="#7B61FF" d="M5.021-16.507H-5.02V16.5H5.02v-33.007z"></path>
      </g>
      <path
        fill="#7B61FF"
        d="M-14.512-4.98h3.11c1.418 0 2.446.202 3.083.608.643.401.964 1.041.964 1.92 0 .598-.14 1.088-.424 1.47-.277.383-.649.614-1.114.691v.068c.634.142 1.09.406 1.367.793.283.388.424.903.424 1.545 0 .912-.33 1.623-.99 2.133-.657.51-1.55.766-2.68.766h-3.74V-4.98zm2.12 3.958h1.23c.574 0 .989-.09 1.244-.267.26-.178.39-.472.39-.882 0-.383-.142-.656-.424-.82-.278-.169-.72-.253-1.327-.253h-1.114v2.222zm0 1.681v2.605h1.38c.584 0 1.014-.112 1.292-.335.278-.224.417-.565.417-1.026 0-.83-.592-1.244-1.777-1.244h-1.313zM1.991 5.014l-.724-2.38h-3.644l-.724 2.38h-2.283l3.527-10.035h2.59L4.277 5.014H1.992zM.762.858A1948.36 1948.36 0 01-.373-2.8a11.457 11.457 0 01-.177-.67c-.15.584-.582 2.026-1.292 4.328H.762zM8.64-.544h.684c.67 0 1.164-.112 1.483-.335.32-.223.479-.574.479-1.053 0-.474-.164-.81-.492-1.011-.324-.2-.827-.301-1.51-.301h-.644v2.7zm0 1.723v3.835H6.52V-4.98h2.913c1.358 0 2.363.248 3.014.745.652.492.978 1.242.978 2.249 0 .588-.162 1.112-.486 1.572-.323.456-.781.813-1.374 1.073a401.063 401.063 0 002.94 4.355h-2.352L9.767 1.179H8.64z"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(.17 -33.71)"
      ></path>
    </svg>
  );
};

export default BarChart;
