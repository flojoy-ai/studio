import { useMantineTheme } from "@mantine/core";

function PlotlyTable() {
  const theme = useMantineTheme();
  if (theme.colorScheme === "dark") {
    return <TableDark />;
  }
  return <TableLight />;
}

export default PlotlyTable;

const TableDark = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="225"
      height="226"
      viewBox="0 0 225 226"
    >
      <path
        fill="#99F5FF"
        fillOpacity="0.2"
        stroke="#99F5FF"
        strokeWidth={"3"}
        strokeOpacity={"0.8"}
        d="M-59.5-54.38a5.5 5.5 0 015.5-5.5H54a5.5 5.5 0 015.5 5.5V54.384a5.5 5.5 0 01-5.5 5.5H-54a5.5 5.5 0 01-5.5-5.5V-54.38z"
        transform="matrix(1.84 0 0 1.84 112.54 113.46) translate(0 -.12)"
      ></path>
      <path
        fill="#99F5FF"
        d="M-18.04 5.02h-2.12v-8.23h-2.713v-1.764h7.547v1.764h-2.714v8.23zm11.35 0l-.725-2.379h-3.643l-.725 2.379h-2.283l3.527-10.035h2.591L-4.407 5.02H-6.69zM-7.92.864a2054.61 2054.61 0 01-1.135-3.658 11.56 11.56 0 01-.178-.67c-.15.584-.581 2.026-1.292 4.328h2.604zm5.758-5.838h3.11c1.417 0 2.445.203 3.083.608.643.401.964 1.042.964 1.921 0 .597-.141 1.087-.424 1.47-.278.383-.65.613-1.114.69v.069c.633.14 1.089.405 1.367.793.283.387.424.902.424 1.544 0 .912-.33 1.623-.991 2.133-.657.51-1.55.766-2.68.766h-3.74v-9.994zm2.119 3.958h1.23c.574 0 .99-.089 1.244-.267.26-.177.39-.471.39-.882 0-.382-.141-.656-.424-.82-.278-.169-.72-.253-1.326-.253H-.043v2.222zm0 1.681V3.27h1.38c.584 0 1.015-.112 1.293-.335.278-.223.417-.565.417-1.025 0-.83-.593-1.245-1.778-1.245H-.043zM8.224 5.02v-9.994h2.12V3.27h4.053v1.75H8.224zm14.652 0H17.12v-9.994h5.756v1.736h-3.637v2.194h3.384V.693h-3.384V3.27h3.637v1.75z"
        transform="matrix(1.84 0 0 1.84 112.54 113.46) translate(-.47 -33.29)"
      ></path>
      <path
        fill="#99F5FF"
        d="M-35.52-2.78a2 2 0 012-2h67.04a2 2 0 012 2v7.557h-71.04V-2.78z"
        transform="matrix(1.84 0 0 1.84 112.54 113.46) translate(.48 -9.64)"
      ></path>
      <path
        fill="#99F5FF"
        fillOpacity="0.4"
        d="M-35.52-21.12h71.04v40.24a2 2 0 01-2 2h-67.04a2 2 0 01-2-2v-40.24z"
        transform="matrix(1.84 0 0 1.84 112.54 113.46) translate(.48 16.3)"
      ></path>
      <rect
        width="54.72"
        height="1.92"
        x="-27.36"
        y="-0.96"
        fill="#99F5FF"
        fillOpacity="0.8"
        rx="0.96"
        ry="0.96"
        transform="matrix(1.84 0 0 1.84 112.54 113.46) translate(8.64 8.62)"
      ></rect>
      <rect
        width="54.72"
        height="1.92"
        x="-27.36"
        y="-0.96"
        fill="#99F5FF"
        fillOpacity="0.8"
        rx="0.96"
        ry="0.96"
        transform="matrix(1.84 0 0 1.84 112.54 113.46) translate(8.64 23.02)"
      ></rect>
      <rect
        width="42.24"
        height="1.92"
        x="-21.12"
        y="-0.96"
        fill="#99F5FF"
        fillOpacity="0.8"
        rx="0.96"
        ry="0.96"
        transform="matrix(1.84 0 0 1.84 112.54 113.46) rotate(90 -8.39 7.91)"
      ></rect>
      <rect
        width="42.24"
        height="1.92"
        x="-21.12"
        y="-0.96"
        fill="#99F5FF"
        fillOpacity="0.8"
        rx="0.96"
        ry="0.96"
        transform="matrix(1.84 0 0 1.84 112.54 113.46) rotate(90 1.21 17.51)"
      ></rect>
      <path
        fill="#99F5FF"
        fillOpacity="0.7"
        d="M-8.16-21.12H8.16v42.24H-6.16a2 2 0 01-2-2v-40.24z"
        transform="matrix(1.84 0 0 1.84 112.54 113.46) translate(-26.88 16.3)"
      ></path>
      <g transform="translate(34.5 82)">
        <path
          stroke="#000"
          strokeWidth="2"
          d="M0 0L0 0"
          vectorEffect="non-scaling-stroke"
        ></path>
      </g>
      <g transform="translate(160.5 183)">
        <path
          stroke="#000"
          strokeWidth="2"
          d="M0 0L0 0"
          vectorEffect="non-scaling-stroke"
        ></path>
      </g>
    </svg>
  );
};

const TableLight = () => {
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
        stroke="#7B61FF"
        strokeWidth={"3"}
        stopOpacity={"0.8"}
        d="M-54-59.88H54a5.5 5.5 0 015.5 5.5V54.384a5.5 5.5 0 01-5.5 5.5H-54a5.5 5.5 0 01-5.5-5.5V-54.38a5.5 5.5 0 015.5-5.5z"
        transform="matrix(1.86 0 0 1.85 112.75 113.09) translate(0 -.12)"
      ></path>
      <path
        fill="#7B61FF"
        d="M-18.04 5.02h-2.12v-8.23h-2.713v-1.764h7.547v1.764h-2.714v8.23zm11.35 0l-.725-2.379h-3.643l-.725 2.379h-2.283l3.527-10.035h2.591L-4.407 5.02H-6.69zM-7.92.864a2054.61 2054.61 0 01-1.135-3.658 11.56 11.56 0 01-.178-.67c-.15.584-.581 2.026-1.292 4.328h2.604zm5.758-5.838h3.11c1.417 0 2.445.203 3.083.608.643.401.964 1.042.964 1.921 0 .597-.141 1.087-.424 1.47-.278.383-.65.613-1.114.69v.069c.633.14 1.089.405 1.367.793.283.387.424.902.424 1.544 0 .912-.33 1.623-.991 2.133-.657.51-1.55.766-2.68.766h-3.74v-9.994zm2.119 3.958h1.23c.574 0 .99-.089 1.244-.267.26-.177.39-.471.39-.882 0-.382-.141-.656-.424-.82-.278-.169-.72-.253-1.326-.253H-.043v2.222zm0 1.681V3.27h1.38c.584 0 1.015-.112 1.293-.335.278-.223.417-.565.417-1.025 0-.83-.593-1.245-1.778-1.245H-.043zM8.224 5.02v-9.994h2.12V3.27h4.053v1.75H8.224zm14.652 0H17.12v-9.994h5.756v1.736h-3.637v2.194h3.384V.693h-3.384V3.27h3.637v1.75z"
        transform="matrix(1.86 0 0 1.85 112.75 113.09) translate(-.47 -33.29)"
      ></path>
      <path
        fill="#7B61FF"
        d="M-35.52-2.78a2 2 0 012-2h67.04a2 2 0 012 2v7.557h-71.04V-2.78z"
        transform="matrix(1.86 0 0 1.85 112.75 113.09) translate(.48 -9.64)"
      ></path>
      <path
        fill="#7A76FF"
        fillOpacity="0.5"
        d="M-35.52-21.12h71.04v40.24a2 2 0 01-2 2h-67.04a2 2 0 01-2-2v-40.24z"
        transform="matrix(1.86 0 0 1.85 112.75 113.09) translate(.48 16.3)"
      ></path>
      <rect
        width="54.72"
        height="1.92"
        x="-27.36"
        y="-0.96"
        fill="#7B61FF"
        rx="0.96"
        ry="0.96"
        transform="matrix(1.86 0 0 1.85 112.75 113.09) translate(8.64 8.62)"
      ></rect>
      <rect
        width="54.72"
        height="1.92"
        x="-27.36"
        y="-0.96"
        fill="#7B61FF"
        rx="0.96"
        ry="0.96"
        transform="matrix(1.86 0 0 1.85 112.75 113.09) translate(8.64 23.02)"
      ></rect>
      <rect
        width="42.24"
        height="1.92"
        x="-21.12"
        y="-0.96"
        fill="#7B61FF"
        rx="0.96"
        ry="0.96"
        transform="matrix(1.86 0 0 1.85 112.75 113.09) rotate(90 -8.39 7.91)"
      ></rect>
      <rect
        width="42.24"
        height="1.92"
        x="-21.12"
        y="-0.96"
        fill="#7B61FF"
        rx="0.96"
        ry="0.96"
        transform="matrix(1.86 0 0 1.85 112.75 113.09) rotate(90 1.21 17.51)"
      ></rect>
      <path
        fill="#7B61FF"
        fillOpacity="0.5"
        d="M-8.16-21.12H8.16v42.24H-6.16a2 2 0 01-2-2v-40.24z"
        transform="matrix(1.86 0 0 1.85 112.75 113.09) translate(-26.88 16.3)"
      ></path>
    </svg>
  );
};
