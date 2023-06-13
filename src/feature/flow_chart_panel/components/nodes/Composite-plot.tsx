import { useMantineTheme } from "@mantine/core";

const CompositePlot = () => {
  const theme = useMantineTheme();
  if (theme.colorScheme === "dark") {
    return <CompositeDark />;
  }
  return <CompositeLight />;
};

const CompositeDark = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="225"
      height="226"
      viewBox="0 0 225 226"
      data-testid="scatter-svg"
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
        strokeOpacity={"0.8"}
        stroke="#99F5FF"
        d="M-59.805-54.69a5.5 5.5 0 015.5-5.5H54.313a5.5 5.5 0 015.5 5.5V54.697a5.5 5.5 0 01-5.5 5.5H-54.305a5.5 5.5 0 01-5.5-5.5V-54.69z"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(.27 -.31)"
      ></path>
      <path
        fill="#99F5FF"
        d="M-25.906 2.224c0 .902-.326 1.613-.977 2.133-.648.52-1.55.779-2.707.779-1.067 0-2.01-.2-2.83-.602V2.566c.674.3 1.244.512 1.708.635.47.123.898.185 1.286.185.464 0 .82-.089 1.066-.267.25-.177.376-.442.376-.793a.86.86 0 00-.164-.52 1.79 1.79 0 00-.485-.444c-.21-.14-.64-.366-1.292-.676-.611-.287-1.07-.563-1.374-.827a3.105 3.105 0 01-.732-.923c-.182-.351-.273-.761-.273-1.23 0-.885.298-1.58.895-2.086.602-.506 1.431-.759 2.489-.759.519 0 1.014.062 1.483.185.474.123.968.296 1.483.52l-.683 1.647a9.891 9.891 0 00-1.326-.458 4.217 4.217 0 00-1.026-.13c-.4 0-.709.094-.923.28a.924.924 0 00-.321.732c0 .187.043.35.13.492.086.137.223.271.41.403.191.128.64.36 1.347.698.934.446 1.574.895 1.92 1.346.347.447.52.996.52 1.648zm7.037-5.599c-.798 0-1.415.3-1.853.902-.437.597-.656 1.431-.656 2.502 0 2.229.836 3.343 2.509 3.343.702 0 1.552-.175 2.55-.526v1.777c-.82.342-1.737.513-2.748.513-1.454 0-2.566-.44-3.336-1.32-.77-.884-1.156-2.15-1.156-3.8 0-1.04.19-1.948.568-2.728.378-.784.92-1.383 1.627-1.798.71-.419 1.542-.629 2.495-.629.97 0 1.946.235 2.925.705l-.683 1.722c-.374-.178-.75-.332-1.128-.465a3.366 3.366 0 00-1.114-.198zM-7.09 5l-.724-2.379h-3.644L-12.18 5h-2.283l3.527-10.036h2.59l3.542 10.035h-2.283zM-8.318.843a1948.36 1948.36 0 01-1.135-3.657 11.457 11.457 0 01-.177-.67c-.15.583-.581 2.025-1.292 4.327h2.604zm9.614 4.156h-2.12v-8.23h-2.713v-1.764h7.547v1.764H1.295v8.23zm9.087 0H8.263v-8.23H5.55v-1.764h7.547v1.764h-2.714v8.23zM21.37 5h-5.756v-9.994h5.756v1.736h-3.637v2.195h3.384V.672h-3.384v2.577h3.637V5zm5.191-5.557h.684c.67 0 1.164-.112 1.483-.335.319-.224.478-.575.478-1.053 0-.474-.164-.811-.492-1.012-.323-.2-.827-.3-1.51-.3h-.643v2.7zm0 1.722V5h-2.12v-9.994h2.913c1.358 0 2.363.248 3.015.745.651.492.977 1.242.977 2.25 0 .587-.162 1.111-.485 1.571-.324.456-.782.814-1.374 1.074a401.063 401.063 0 002.94 4.354h-2.352l-2.386-3.835h-1.128z"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(.4 -33.67)"
      ></path>
      <g
        clipPath="url(#CLIPPATH_43)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(7.41 22.19)"
      >
        <clipPath id="CLIPPATH_43">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-7.16 -6.53)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.003 3.553a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_44)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(12.94 18.24)"
      >
        <clipPath id="CLIPPATH_44">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-12.68 -2.58)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.002 3.556a3.552 3.552 0 100-7.103 3.552 3.552 0 000 7.103z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_45)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(12.94 26.14)"
      >
        <clipPath id="CLIPPATH_45">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-12.68 -10.48)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.002 3.55a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.103z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_46)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(16.1 26.14)"
      >
        <clipPath id="CLIPPATH_46">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-15.84 -10.48)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.004 3.55a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.103z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_47)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(27.71 16.23)"
      >
        <clipPath id="CLIPPATH_47">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-27.46 -.57)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.005 3.554a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
          opacity="0.9"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_48)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(11.36 12.72)"
      >
        <clipPath id="CLIPPATH_48">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-11.11 2.94)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M0 3.552a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
          opacity="0.9"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_49)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(8.99 7.19)"
      >
        <clipPath id="CLIPPATH_49">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-8.74 8.47)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.002 3.556a3.552 3.552 0 100-7.103 3.552 3.552 0 000 7.103z"
          opacity="0.75"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_50)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(11.36 3.25)"
      >
        <clipPath id="CLIPPATH_50">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-11.11 12.41)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M0 3.55a3.552 3.552 0 100-7.104A3.552 3.552 0 000 3.55z"
          opacity="0.75"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_51)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(15.31 .09)"
      >
        <clipPath id="CLIPPATH_51">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-15.05 15.57)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.004 3.553a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_52)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(-27.54 25.7)"
      >
        <clipPath id="CLIPPATH_52">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(27.79 -10.04)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.002 3.555a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_53)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(-17.37 19.92)"
      >
        <clipPath id="CLIPPATH_53">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(17.63 -4.26)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.002 3.547a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_54)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(-13.9 6.41)"
      >
        <clipPath id="CLIPPATH_54">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(14.15 9.25)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.001 3.547a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_55)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(-6.79 25.35)"
      >
        <clipPath id="CLIPPATH_55">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(7.05 -9.69)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.005 3.55a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_56)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(-3.64 22.19)"
      >
        <clipPath id="CLIPPATH_56">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(3.89 -6.53)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.002 3.553a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_57)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(1.1 22.19)"
      >
        <clipPath id="CLIPPATH_57">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-.84 -6.53)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.002 3.553a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_58)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(-3.64 .09)"
      >
        <clipPath id="CLIPPATH_58">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(3.89 15.57)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.002 3.553a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_59)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(-44.9 15.44)"
      >
        <clipPath id="CLIPPATH_59">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(45.16 .22)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.004 3.554a3.552 3.552 0 100-7.103 3.552 3.552 0 000 7.103z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_60)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(-6.23 34.39)"
      >
        <clipPath id="CLIPPATH_60">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(6.48 -18.73)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.003 3.547a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_61)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(-30.78 7.25)"
      >
        <clipPath id="CLIPPATH_61">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(31.04 8.41)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.005 3.55a3.552 3.552 0 100-7.105 3.552 3.552 0 000 7.104z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_62)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(-11.02 3.73)"
      >
        <clipPath id="CLIPPATH_62">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(11.27 11.93)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.001 3.55a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_63)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(-31.49 3.6)"
      >
        <clipPath id="CLIPPATH_63">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(31.74 12.06)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.005 3.555a3.552 3.552 0 100-7.103 3.552 3.552 0 000 7.103z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_64)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(8.99 39.56)"
      >
        <clipPath id="CLIPPATH_64">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-8.74 -23.9)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.002 3.547a3.552 3.552 0 100-7.103 3.552 3.552 0 000 7.103z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_65)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(35.15 19.88)"
      >
        <clipPath id="CLIPPATH_65">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-34.9 -4.22)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M0 3.55a3.552 3.552 0 100-7.103A3.552 3.552 0 000 3.55z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_66)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(45.41 13.56)"
      >
        <clipPath id="CLIPPATH_66">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-45.16 2.1)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.001 3.556a3.552 3.552 0 100-7.103 3.552 3.552 0 000 7.103z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_67)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(19.92 5.25)"
      >
        <clipPath id="CLIPPATH_67">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-19.67 10.41)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.004 3.547a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_68)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(34.82 23.34)"
      >
        <clipPath id="CLIPPATH_68">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-34.56 -7.68)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.002 3.547a3.552 3.552 0 100-7.103 3.552 3.552 0 000 7.103z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_69)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(17.56 17.08)"
      >
        <clipPath id="CLIPPATH_69">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-17.3 -1.42)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.004 3.556a3.552 3.552 0 100-7.103 3.552 3.552 0 000 7.103z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_70)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(7.77 29.67)"
      >
        <clipPath id="CLIPPATH_70">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-7.51 -14.01)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.002 3.555a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_71)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(10.93 32.83)"
      >
        <clipPath id="CLIPPATH_71">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-10.67 -17.17)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.005 3.552a3.552 3.552 0 100-7.103 3.552 3.552 0 000 7.103z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_72)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(28.51 29.32)"
      >
        <clipPath id="CLIPPATH_72">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-28.26 -13.66)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.002 3.55a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_73)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(31.67 26.16)"
      >
        <clipPath id="CLIPPATH_73">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-31.42 -10.5)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.001 3.553a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_74)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(36.41 26.16)"
      >
        <clipPath id="CLIPPATH_74">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-36.15 -10.5)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.005 3.553a3.552 3.552 0 100-7.104 3.552 3.552 0 000 7.104z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_75)"
        transform="matrix(1.86 0 0 1.85 112.75 113.13) translate(29.08 38.36)"
      >
        <clipPath id="CLIPPATH_75">
          <rect
            width="97.419"
            height="54.895"
            x="-48.709"
            y="-27.447"
            rx="0"
            ry="0"
            transform="translate(-28.83 -22.7)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M0 3.547a3.552 3.552 0 100-7.103 3.552 3.552 0 000 7.103z"
          opacity="0.59"
        ></path>
      </g>
    </svg>
  );
};

const CompositeLight = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="225"
      height="226"
      viewBox="0 0 225 226"
      data-testid="scatter-svg"
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
        strokeOpacity={"0.8"}
        stroke="#7B61FF"
        d="M-59.726-54.61a5.5 5.5 0 015.5-5.5h108.46a5.5 5.5 0 015.5 5.5V54.617a5.5 5.5 0 01-5.5 5.5h-108.46a5.5 5.5 0 01-5.5-5.5V-54.61z"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(.19 -.39)"
      ></path>
      <path
        fill="#7B61FF"
        d="M-25.906 2.228c0 .903-.326 1.614-.978 2.133-.647.52-1.55.78-2.707.78-1.066 0-2.01-.201-2.83-.602V2.57c.674.3 1.244.513 1.709.636.47.123.898.184 1.285.184.465 0 .82-.088 1.067-.266.25-.178.376-.442.376-.793a.86.86 0 00-.165-.52 1.79 1.79 0 00-.485-.444c-.21-.141-.64-.367-1.292-.677-.61-.287-1.069-.563-1.374-.827a3.106 3.106 0 01-.731-.923c-.183-.35-.274-.76-.274-1.23 0-.884.299-1.58.896-2.085.601-.506 1.43-.759 2.488-.759.52 0 1.014.061 1.484.185.473.123.968.296 1.483.52l-.684 1.647a9.905 9.905 0 00-1.326-.458 4.217 4.217 0 00-1.025-.13c-.401 0-.709.093-.923.28a.924.924 0 00-.321.731c0 .187.043.351.13.493a1.5 1.5 0 00.41.403c.191.128.64.36 1.346.697.935.447 1.575.896 1.921 1.347.346.446.52.996.52 1.647zm7.036-5.598c-.797 0-1.415.3-1.852.902-.438.597-.656 1.431-.656 2.502 0 2.228.836 3.343 2.508 3.343.702 0 1.552-.176 2.55-.527v1.778c-.82.341-1.736.512-2.748.512-1.454 0-2.566-.44-3.336-1.319-.77-.884-1.155-2.15-1.155-3.8 0-1.04.189-1.949.567-2.728.378-.784.92-1.383 1.627-1.798.711-.42 1.543-.629 2.495-.629.971 0 1.946.235 2.926.704l-.683 1.723c-.374-.178-.75-.333-1.128-.465a3.367 3.367 0 00-1.115-.198zm11.781 8.374l-.724-2.38h-3.644l-.725 2.38h-2.283l3.527-10.035h2.591l3.541 10.035h-2.283zM-8.319.848A1948.36 1948.36 0 01-9.454-2.81a11.457 11.457 0 01-.178-.67c-.15.584-.58 2.026-1.292 4.328h2.605zm9.613 4.156H-.825v-8.23h-2.714V-4.99h7.547v1.763H1.294v8.23zm9.088 0h-2.12v-8.23H5.55V-4.99h7.547v1.763h-2.714v8.23zm10.988 0h-5.756V-4.99h5.756v1.736h-3.637v2.194h3.384V.677h-3.384v2.577h3.637v1.75zm5.19-5.558h.684c.67 0 1.165-.112 1.484-.335.319-.223.478-.574.478-1.053 0-.474-.164-.81-.492-1.011-.324-.2-.827-.301-1.51-.301h-.643v2.7zm0 1.723v3.835h-2.119V-4.99h2.913c1.358 0 2.363.248 3.014.745.652.492.978 1.242.978 2.249 0 .588-.162 1.112-.486 1.572-.323.456-.781.813-1.374 1.073a403.195 403.195 0 002.94 4.355h-2.352l-2.386-3.835h-1.127z"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(.32 -33.7)"
      ></path>
      <g
        clipPath="url(#CLIPPATH_9)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(7.32 22.08)"
      >
        <clipPath id="CLIPPATH_9">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-7.15 -6.52)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.003 3.549a3.547 3.547 0 100-7.094 3.547 3.547 0 000 7.094z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_10)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(12.84 18.14)"
      >
        <clipPath id="CLIPPATH_10">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-12.67 -2.58)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.001 3.547a3.547 3.547 0 100-7.094 3.547 3.547 0 000 7.095z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_11)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(12.84 26.02)"
      >
        <clipPath id="CLIPPATH_11">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-12.67 -10.46)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.001 3.55a3.547 3.547 0 100-7.094 3.547 3.547 0 000 7.094z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_12)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(15.99 26.02)"
      >
        <clipPath id="CLIPPATH_12">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-15.82 -10.46)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.004 3.55a3.547 3.547 0 100-7.094 3.547 3.547 0 000 7.094z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_13)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(27.6 16.13)"
      >
        <clipPath id="CLIPPATH_13">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-27.42 -.57)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.002 3.547a3.547 3.547 0 100-7.094 3.547 3.547 0 000 7.095z"
          opacity="0.9"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_14)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(11.26 12.62)"
      >
        <clipPath id="CLIPPATH_14">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-11.09 2.94)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.004 3.55a3.547 3.547 0 100-7.094 3.547 3.547 0 000 7.094z"
          opacity="0.9"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_15)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(8.9 7.11)"
      >
        <clipPath id="CLIPPATH_15">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-8.73 8.45)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M0 3.542a3.547 3.547 0 100-7.094 3.547 3.547 0 000 7.094z"
          opacity="0.75"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_16)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(11.26 3.16)"
      >
        <clipPath id="CLIPPATH_16">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-11.09 12.4)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.004 3.55a3.547 3.547 0 100-7.093 3.547 3.547 0 000 7.094z"
          opacity="0.75"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_17)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(15.21 .01)"
      >
        <clipPath id="CLIPPATH_17">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-15.03 15.55)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.004 3.548a3.547 3.547 0 100-7.095 3.547 3.547 0 000 7.095z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_18)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(-27.58 25.59)"
      >
        <clipPath id="CLIPPATH_18">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(27.76 -10.03)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.003 3.546a3.547 3.547 0 100-7.094 3.547 3.547 0 000 7.094z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_19)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(-17.43 19.81)"
      >
        <clipPath id="CLIPPATH_19">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(17.6 -4.25)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M0 3.546A3.547 3.547 0 100-3.55a3.547 3.547 0 000 7.095z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_20)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(-13.96 6.32)"
      >
        <clipPath id="CLIPPATH_20">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(14.13 9.24)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M0 3.544A3.547 3.547 0 100-3.55a3.547 3.547 0 000 7.094z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_21)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(-6.87 25.23)"
      >
        <clipPath id="CLIPPATH_21">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(7.04 -9.68)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.004 3.552a3.547 3.547 0 100-7.095 3.547 3.547 0 000 7.095z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_22)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(-3.71 22.08)"
      >
        <clipPath id="CLIPPATH_22">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(3.89 -6.52)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.003 3.549a3.547 3.547 0 100-7.095 3.547 3.547 0 000 7.095z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_23)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(1.02 22.08)"
      >
        <clipPath id="CLIPPATH_23">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-.84 -6.52)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.004 3.549a3.547 3.547 0 100-7.094 3.547 3.547 0 000 7.094z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_24)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(-3.71 .01)"
      >
        <clipPath id="CLIPPATH_24">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(3.89 15.55)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.003 3.548a3.547 3.547 0 100-7.095 3.547 3.547 0 000 7.095z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_25)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(-44.92 15.34)"
      >
        <clipPath id="CLIPPATH_25">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(45.1 .22)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.005 3.55a3.547 3.547 0 100-7.095 3.547 3.547 0 000 7.094z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_26)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(-6.3 34.26)"
      >
        <clipPath id="CLIPPATH_26">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(6.47 -18.7)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.001 3.547a3.547 3.547 0 100-7.094 3.547 3.547 0 000 7.094z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_27)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(-30.82 7.16)"
      >
        <clipPath id="CLIPPATH_27">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(31 8.4)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.005 3.545a3.547 3.547 0 100-7.095 3.547 3.547 0 000 7.095z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_28)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(-11.08 3.64)"
      >
        <clipPath id="CLIPPATH_28">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(11.26 11.92)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.005 3.55a3.547 3.547 0 100-7.094 3.547 3.547 0 000 7.094z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_29)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(-31.52 3.52)"
      >
        <clipPath id="CLIPPATH_29">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(31.7 12.04)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.004 3.546a3.547 3.547 0 100-7.095 3.547 3.547 0 000 7.095z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_30)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(8.9 39.42)"
      >
        <clipPath id="CLIPPATH_30">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-8.73 -23.86)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M0 3.55a3.547 3.547 0 100-7.094A3.547 3.547 0 000 3.55z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_31)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(35.02 19.77)"
      >
        <clipPath id="CLIPPATH_31">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-34.85 -4.21)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.003 3.55a3.547 3.547 0 100-7.095 3.547 3.547 0 000 7.094z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_32)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(45.27 13.47)"
      >
        <clipPath id="CLIPPATH_32">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-45.1 2.09)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.001 3.543a3.547 3.547 0 100-7.094 3.547 3.547 0 000 7.094z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_33)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(19.82 5.16)"
      >
        <clipPath id="CLIPPATH_33">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-19.64 10.4)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.003 3.545a3.547 3.547 0 100-7.094 3.547 3.547 0 000 7.094z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_34)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(34.69 23.22)"
      >
        <clipPath id="CLIPPATH_34">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-34.52 -7.67)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.002 3.552a3.547 3.547 0 100-7.095 3.547 3.547 0 000 7.095z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_35)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(17.45 16.98)"
      >
        <clipPath id="CLIPPATH_35">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-17.28 -1.42)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.003 3.549a3.547 3.547 0 100-7.095 3.547 3.547 0 000 7.095z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_36)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(7.68 29.55)"
      >
        <clipPath id="CLIPPATH_36">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-7.5 -14)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.002 3.551a3.547 3.547 0 100-7.094 3.547 3.547 0 000 7.094z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_37)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(10.83 32.71)"
      >
        <clipPath id="CLIPPATH_37">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-10.66 -17.15)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M0 3.544A3.547 3.547 0 10.002-3.55a3.547 3.547 0 000 7.094z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_38)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(28.39 29.2)"
      >
        <clipPath id="CLIPPATH_38">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-28.22 -13.64)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.004 3.547a3.547 3.547 0 100-7.095 3.547 3.547 0 000 7.095z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_39)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(31.55 26.05)"
      >
        <clipPath id="CLIPPATH_39">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-31.37 -10.49)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.003 3.544a3.547 3.547 0 100-7.095 3.547 3.547 0 000 7.095z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_40)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(36.28 26.05)"
      >
        <clipPath id="CLIPPATH_40">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-36.1 -10.49)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.003 3.544a3.547 3.547 0 100-7.095 3.547 3.547 0 000 7.095z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_41)"
        transform="matrix(1.85 0 0 1.86 112.38 113.75) translate(28.96 38.23)"
      >
        <clipPath id="CLIPPATH_41">
          <rect
            width="97.291"
            height="54.822"
            x="-48.645"
            y="-27.411"
            rx="0"
            ry="0"
            transform="translate(-28.79 -22.67)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.002 3.552a3.547 3.547 0 100-7.094 3.547 3.547 0 000 7.094z"
          opacity="0.59"
        ></path>
      </g>
    </svg>
  );
};

export default CompositePlot;
