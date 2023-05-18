import { useMantineTheme } from "@mantine/core";

const Scatter3D = () => {
  const theme = useMantineTheme();
  if (theme.colorScheme === "dark") {
    return <Scatter3DDark />;
  }
  return <Scatter3DLight />;
};

const Scatter3DDark = () => {
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
        strokeOpacity={"0.8"}
        stroke="#99F5FF"
        d="M-59.809-54.69a5.5 5.5 0 015.5-5.5H54.31a5.5 5.5 0 015.5 5.5V54.697a5.5 5.5 0 01-5.5 5.5H-54.309a5.5 5.5 0 01-5.5-5.5V-54.69z"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-.15 -.31)"
      ></path>
      <path
        fill="#99F5FF"
        d="M-3.325-12.26c0 .625-.19 1.156-.568 1.593-.378.438-.909.738-1.593.902v.041c.807.1 1.418.347 1.832.739.415.387.623.911.623 1.572 0 .962-.35 1.711-1.046 2.249-.698.533-1.693.8-2.988.8-1.084 0-2.046-.18-2.884-.54v-1.798c.387.196.813.355 1.278.478.465.124.925.185 1.38.185.698 0 1.213-.118 1.546-.355.332-.237.499-.618.499-1.142 0-.47-.192-.802-.575-.998-.382-.196-.993-.294-1.832-.294h-.758v-1.62h.772c.775 0 1.34-.1 1.695-.3.36-.206.54-.555.54-1.047 0-.756-.473-1.135-1.421-1.135-.329 0-.663.055-1.005.165-.338.109-.713.298-1.128.567l-.978-1.456c.912-.656 1.999-.985 3.26-.985 1.035 0 1.851.21 2.448.63.602.419.903 1.002.903 1.75zm11.37 2.666c0 1.646-.47 2.906-1.408 3.78C5.703-4.937 4.352-4.5 2.583-4.5h-2.83v-9.994h3.138c1.631 0 2.898.43 3.8 1.292.903.861 1.354 2.064 1.354 3.61zm-2.201.055c0-2.146-.948-3.22-2.844-3.22H1.872v6.508h.91c2.041 0 3.062-1.096 3.062-3.288zm-31.753 21.263c0 .902-.326 1.613-.978 2.133-.647.52-1.55.779-2.707.779-1.066 0-2.01-.2-2.83-.602v-1.969c.674.301 1.244.513 1.709.636.47.123.898.185 1.285.185.465 0 .82-.089 1.066-.267.251-.177.376-.442.376-.793a.86.86 0 00-.164-.52 1.79 1.79 0 00-.485-.444c-.21-.14-.64-.367-1.292-.676-.61-.288-1.069-.563-1.374-.828a3.105 3.105 0 01-.731-.922c-.183-.351-.274-.761-.274-1.23 0-.885.299-1.58.896-2.086.601-.506 1.43-.759 2.488-.759.52 0 1.014.062 1.483.185.474.123.969.296 1.484.52l-.684 1.647a9.891 9.891 0 00-1.326-.458 4.215 4.215 0 00-1.025-.13c-.401 0-.71.093-.923.28a.924.924 0 00-.322.732c0 .187.044.35.13.492.087.137.224.271.41.403.192.128.64.36 1.347.698.934.446 1.575.895 1.921 1.346.346.447.52.996.52 1.648zm7.036-5.599c-.797 0-1.415.3-1.852.902-.438.597-.657 1.431-.657 2.502 0 2.229.837 3.343 2.51 3.343.701 0 1.55-.175 2.549-.526v1.777c-.82.342-1.736.513-2.748.513-1.454 0-2.566-.44-3.336-1.32-.77-.884-1.155-2.15-1.155-3.8 0-1.04.189-1.948.567-2.728.378-.784.92-1.383 1.627-1.798.711-.419 1.543-.629 2.495-.629.97 0 1.946.235 2.926.705l-.684 1.722c-.373-.178-.75-.332-1.128-.465a3.366 3.366 0 00-1.114-.198zM-7.092 14.5l-.725-2.379h-3.643l-.725 2.38h-2.283l3.527-10.036h2.591l3.541 10.035h-2.283zm-1.23-4.156a2039.46 2039.46 0 01-1.135-3.657 11.457 11.457 0 01-.178-.67c-.15.583-.581 2.025-1.292 4.327h2.605zm9.613 4.156H-.828V6.27h-2.714V4.505h7.547v1.764H1.291v8.23zm9.088 0h-2.12V6.27H5.547V4.505h7.547v1.764h-2.714v8.23zm10.988 0H15.61V4.505h5.756v1.736H17.73v2.195h3.384v1.736H17.73v2.577h3.637v1.75zm5.19-5.557h.684c.67 0 1.164-.112 1.483-.335.32-.224.479-.575.479-1.053 0-.474-.164-.811-.492-1.012-.324-.2-.827-.3-1.511-.3h-.643v2.7zm0 1.722V14.5h-2.119V4.505h2.912c1.359 0 2.363.248 3.015.745.652.492.978 1.242.978 2.25 0 .587-.162 1.111-.486 1.571-.323.456-.781.814-1.374 1.074a402.632 402.632 0 002.94 4.354H30.07l-2.386-3.835h-1.128z"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-.02 -33.17)"
      ></path>
      <g
        clipPath="url(#CLIPPATH_115)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-.15 31.32)"
      >
        <clipPath id="CLIPPATH_115">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(0 -21.4)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-14.485-10.3l-34.244 20.605h68.934l28.526-20.604h-63.216z"
          opacity="0.9"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_116)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(4.99 25.27)"
      >
        <clipPath id="CLIPPATH_116">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-5.14 -15.35)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.004 3.243c1.775 0 3.214-1.45 3.214-3.24 0-1.79-1.44-3.24-3.214-3.24-1.776 0-3.215 1.45-3.215 3.24 0 1.79 1.44 3.24 3.215 3.24z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_117)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-15.75 26.19)"
      >
        <clipPath id="CLIPPATH_117">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(15.6 -16.27)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M-.001 3.24c1.775 0 3.214-1.45 3.214-3.24 0-1.79-1.44-3.24-3.214-3.24-1.776 0-3.215 1.45-3.215 3.24 0 1.79 1.44 3.24 3.215 3.24z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_118)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(10.3 31.98)"
      >
        <clipPath id="CLIPPATH_118">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-10.45 -22.06)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.002 3.24c1.776 0 3.215-1.451 3.215-3.24 0-1.79-1.44-3.24-3.215-3.24S-3.212-1.79-3.212 0c0 1.789 1.439 3.24 3.214 3.24z"
          opacity="0.8"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_119)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-3.8 17.86)"
      >
        <clipPath id="CLIPPATH_119">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(3.65 -7.93)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.003 3.047c1.672 0 3.027-1.365 3.027-3.05 0-1.685-1.355-3.05-3.027-3.05-1.671 0-3.026 1.365-3.026 3.05 0 1.685 1.355 3.05 3.026 3.05z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_120)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(9.65 4.36)"
      >
        <clipPath id="CLIPPATH_120">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-9.8 5.56)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.001 3.052c1.671 0 3.027-1.366 3.027-3.05 0-1.685-1.356-3.051-3.027-3.051S-3.028-1.683-3.028.001c0 1.685 1.356 3.051 3.027 3.051z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_121)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(9.65 11.14)"
      >
        <clipPath id="CLIPPATH_121">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-9.8 -1.22)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.001 3.05C1.67 3.05 3.026 1.684 3.026 0c0-1.686-1.356-3.051-3.027-3.051s-3.027 1.365-3.027 3.05c0 1.685 1.356 3.05 3.027 3.05z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_122)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-28.48 11.53)"
      >
        <clipPath id="CLIPPATH_122">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(28.33 -1.6)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.003 3.047c1.671 0 3.026-1.366 3.026-3.05 0-1.685-1.355-3.05-3.026-3.05-1.672 0-3.027 1.365-3.027 3.05 0 1.684 1.355 3.05 3.027 3.05z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_123)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(22.24 2.63)"
      >
        <clipPath id="CLIPPATH_123">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-22.39 7.29)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.002 3.053c1.671 0 3.026-1.366 3.026-3.05 0-1.685-1.355-3.05-3.026-3.05-1.672 0-3.027 1.365-3.027 3.05 0 1.684 1.355 3.05 3.027 3.05z"
          opacity="0.9"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_124)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(8.3 -.39)"
      >
        <clipPath id="CLIPPATH_124">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-8.45 10.31)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.004 3.054c1.671 0 3.027-1.366 3.027-3.05 0-1.685-1.356-3.051-3.027-3.051-1.672 0-3.027 1.366-3.027 3.05 0 1.685 1.355 3.05 3.027 3.05z"
          opacity="0.9"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_125)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(6.29 -5.13)"
      >
        <clipPath id="CLIPPATH_125">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-6.43 15.06)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.005 3.048c1.672 0 3.027-1.366 3.027-3.05 0-1.685-1.355-3.05-3.027-3.05-1.671 0-3.026 1.365-3.026 3.05 0 1.684 1.355 3.05 3.026 3.05z"
          opacity="0.75"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_126)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(8.3 -8.52)"
      >
        <clipPath id="CLIPPATH_126">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-8.45 18.45)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.004 3.048c1.671 0 3.027-1.366 3.027-3.05 0-1.685-1.356-3.051-3.027-3.051-1.672 0-3.027 1.366-3.027 3.05 0 1.685 1.355 3.051 3.027 3.051z"
          opacity="0.75"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_127)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(11.67 -11.23)"
      >
        <clipPath id="CLIPPATH_127">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-11.82 21.16)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.002 3.047c1.671 0 3.026-1.366 3.026-3.05 0-1.685-1.355-3.05-3.026-3.05-1.672 0-3.027 1.365-3.027 3.05 0 1.684 1.355 3.05 3.027 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_128)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-24.85 10.77)"
      >
        <clipPath id="CLIPPATH_128">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(24.7 -.84)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.002 3.049c1.672 0 3.027-1.366 3.027-3.05 0-1.685-1.355-3.051-3.027-3.051-1.671 0-3.026 1.366-3.026 3.05 0 1.685 1.355 3.05 3.026 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_129)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-16.18 5.79)"
      >
        <clipPath id="CLIPPATH_129">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(16.03 4.13)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.002 3.055c1.672 0 3.027-1.366 3.027-3.05 0-1.685-1.355-3.05-3.027-3.05-1.671 0-3.027 1.365-3.027 3.05 0 1.684 1.356 3.05 3.027 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_130)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-13.22 -5.81)"
      >
        <clipPath id="CLIPPATH_130">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(13.07 15.73)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.002 3.052c1.671 0 3.026-1.366 3.026-3.05 0-1.685-1.355-3.051-3.026-3.051C-1.674-3.05-3.03-1.683-3.03 0c0 1.685 1.355 3.05 3.027 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_131)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-7.17 10.46)"
      >
        <clipPath id="CLIPPATH_131">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(7.02 -.54)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.001 3.053c1.672 0 3.027-1.366 3.027-3.05 0-1.685-1.355-3.05-3.027-3.05-1.671 0-3.026 1.365-3.026 3.05 0 1.684 1.355 3.05 3.026 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_132)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-4.48 7.75)"
      >
        <clipPath id="CLIPPATH_132">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(4.33 2.17)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.004 3.05c1.671 0 3.026-1.366 3.026-3.051S1.675-3.051.004-3.051c-1.672 0-3.027 1.365-3.027 3.05 0 1.685 1.355 3.05 3.027 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_133)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-.44 7.75)"
      >
        <clipPath id="CLIPPATH_133">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(.29 2.17)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.002 3.05c1.672 0 3.027-1.366 3.027-3.051S1.67-3.051-.002-3.051c-1.671 0-3.026 1.365-3.026 3.05 0 1.685 1.355 3.05 3.026 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_134)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-4.48 -11.23)"
      >
        <clipPath id="CLIPPATH_134">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(4.33 21.16)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.004 3.047c1.671 0 3.026-1.366 3.026-3.05 0-1.685-1.355-3.05-3.026-3.05-1.672 0-3.027 1.365-3.027 3.05 0 1.684 1.355 3.05 3.027 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_135)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-6.68 18.23)"
      >
        <clipPath id="CLIPPATH_135">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(6.53 -8.3)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.003 3.046c1.672 0 3.027-1.366 3.027-3.05 0-1.686-1.355-3.051-3.027-3.051-1.671 0-3.026 1.365-3.026 3.05 0 1.685 1.355 3.05 3.026 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_136)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-27.61 -5.09)"
      >
        <clipPath id="CLIPPATH_136">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(27.47 15.01)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.005 3.055c1.672 0 3.027-1.366 3.027-3.05 0-1.685-1.355-3.051-3.027-3.051-1.671 0-3.026 1.366-3.026 3.05 0 1.685 1.355 3.05 3.026 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_137)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-10.77 -8.11)"
      >
        <clipPath id="CLIPPATH_137">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(10.62 18.03)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.001 3.053c1.672 0 3.027-1.366 3.027-3.05 0-1.685-1.355-3.051-3.027-3.051-1.671 0-3.026 1.366-3.026 3.05 0 1.685 1.355 3.05 3.026 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_138)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-28.21 -8.22)"
      >
        <clipPath id="CLIPPATH_138">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(28.06 18.14)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.001 3.054c1.671 0 3.026-1.366 3.026-3.05C3.025-1.682 1.67-3.048 0-3.048c-1.672 0-3.027 1.366-3.027 3.05 0 1.685 1.355 3.051 3.027 3.051z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_139)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(6.29 22.66)"
      >
        <clipPath id="CLIPPATH_139">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-6.43 -12.74)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M-.005 3.055c1.672 0 3.027-1.365 3.027-3.05 0-1.685-1.355-3.05-3.027-3.05-1.671 0-3.026 1.365-3.026 3.05 0 1.685 1.355 3.05 3.026 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_140)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(28.58 5.76)"
      >
        <clipPath id="CLIPPATH_140">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-28.73 4.16)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M0 3.054c1.672 0 3.027-1.366 3.027-3.05 0-1.685-1.355-3.05-3.027-3.05-1.671 0-3.026 1.365-3.026 3.05 0 1.684 1.355 3.05 3.026 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_141)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(37.33 .34)"
      >
        <clipPath id="CLIPPATH_141">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-37.48 9.58)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.004 3.05c1.671 0 3.027-1.366 3.027-3.05 0-1.686-1.356-3.051-3.027-3.051s-3.027 1.365-3.027 3.05c0 1.685 1.356 3.05 3.027 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_142)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(15.6 -6.81)"
      >
        <clipPath id="CLIPPATH_142">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-15.75 16.73)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.002 3.054c1.671 0 3.027-1.366 3.027-3.05 0-1.685-1.356-3.051-3.027-3.051-1.672 0-3.027 1.366-3.027 3.05 0 1.685 1.355 3.05 3.027 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_143)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(28.3 8.73)"
      >
        <clipPath id="CLIPPATH_143">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-28.45 1.19)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.003 3.054c1.672 0 3.027-1.365 3.027-3.05 0-1.685-1.355-3.05-3.027-3.05-1.671 0-3.026 1.365-3.026 3.05 0 1.685 1.355 3.05 3.026 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_144)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(13.59 3.36)"
      >
        <clipPath id="CLIPPATH_144">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-13.74 6.56)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M-.004 3.054c1.671 0 3.026-1.366 3.026-3.05 0-1.685-1.355-3.051-3.026-3.051-1.672 0-3.027 1.366-3.027 3.05 0 1.685 1.355 3.051 3.027 3.051z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_145)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(5.24 14.18)"
      >
        <clipPath id="CLIPPATH_145">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-5.39 -4.25)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.004 3.047c1.671 0 3.027-1.366 3.027-3.05 0-1.685-1.356-3.05-3.027-3.05s-3.027 1.365-3.027 3.05c0 1.684 1.356 3.05 3.027 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_146)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(7.93 16.89)"
      >
        <clipPath id="CLIPPATH_146">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-8.08 -6.97)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.004 3.05C1.675 3.05 3.03 1.686 3.03 0c0-1.684-1.355-3.05-3.026-3.05-1.672 0-3.027 1.366-3.027 3.05 0 1.685 1.355 3.05 3.027 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_147)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(22.92 13.87)"
      >
        <clipPath id="CLIPPATH_147">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-23.07 -3.95)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.003 3.054c1.671 0 3.027-1.366 3.027-3.05 0-1.685-1.356-3.051-3.027-3.051-1.672 0-3.027 1.366-3.027 3.05 0 1.685 1.355 3.05 3.027 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_148)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(25.61 11.16)"
      >
        <clipPath id="CLIPPATH_148">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-25.76 -1.24)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M.003 3.05c1.671 0 3.026-1.366 3.026-3.05 0-1.685-1.355-3.05-3.026-3.05-1.672 0-3.027 1.365-3.027 3.05 0 1.684 1.355 3.05 3.027 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_149)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(29.65 11.16)"
      >
        <clipPath id="CLIPPATH_149">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-29.8 -1.24)"
          ></rect>
        </clipPath>
        <path
          fill="#99F5FF"
          d="M0 3.05c1.671 0 3.027-1.366 3.027-3.05C3.027-1.685 1.67-3.05 0-3.05c-1.672 0-3.027 1.365-3.027 3.05 0 1.684 1.355 3.05 3.027 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_150)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(23.41 21.64)"
      >
        <clipPath id="CLIPPATH_150">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(-23.56 -11.71)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M-.004 3.046c1.672 0 3.027-1.366 3.027-3.05 0-1.685-1.355-3.05-3.027-3.05-1.671 0-3.026 1.365-3.026 3.05 0 1.684 1.355 3.05 3.026 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_151)"
        transform="matrix(1.87 0 0 1.86 112.91 113.25) translate(-18.15 24.05)"
      >
        <clipPath id="CLIPPATH_151">
          <rect
            width="97.46"
            height="62.722"
            x="-48.73"
            y="-31.361"
            rx="0"
            ry="0"
            transform="translate(18 -14.13)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M0 3.239c1.776 0 3.215-1.45 3.215-3.24 0-1.79-1.44-3.24-3.215-3.24S-3.214-1.79-3.214 0c0 1.79 1.44 3.24 3.214 3.24z"
          opacity="0.8"
        ></path>
      </g>
    </svg>
  );
};

const Scatter3DLight = () => {
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
        strokeOpacity={"0.8"}
        stroke="#7B61FF"
        d="M-59.734-54.61a5.5 5.5 0 015.5-5.5h108.46a5.5 5.5 0 015.5 5.5V54.617a5.5 5.5 0 01-5.5 5.5h-108.46a5.5 5.5 0 01-5.5-5.5V-54.61z"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(.06 -.39)"
      ></path>
      <path
        fill="#7B61FF"
        d="M-3.32-12.255c0 .624-.19 1.155-.568 1.593-.378.437-.909.738-1.592.902v.041c.806.1 1.417.346 1.832.738.414.388.622.912.622 1.573 0 .961-.349 1.71-1.046 2.249-.697.533-1.693.8-2.987.8-1.085 0-2.047-.18-2.885-.54v-1.799c.387.197.813.356 1.278.48a5.38 5.38 0 001.38.184c.698 0 1.213-.119 1.546-.356.333-.237.499-.617.499-1.141 0-.47-.191-.803-.574-.999-.383-.196-.994-.293-1.832-.293h-.76v-1.62h.773c.775 0 1.34-.1 1.696-.301.36-.205.54-.554.54-1.046 0-.757-.474-1.135-1.422-1.135-.328 0-.663.055-1.005.164-.337.11-.713.299-1.128.567l-.978-1.456c.912-.656 1.999-.984 3.261-.984 1.035 0 1.85.21 2.447.629.602.42.903 1.002.903 1.75zM8.05-9.59c0 1.645-.469 2.905-1.408 3.78-.934.875-2.285 1.313-4.053 1.313h-2.83v-9.994h3.137c1.632 0 2.899.43 3.8 1.292.903.86 1.354 2.064 1.354 3.609zm-2.2.055c0-2.147-.949-3.22-2.844-3.22H1.878v6.508h.909c2.041 0 3.062-1.096 3.062-3.288zm-31.754 21.262c0 .903-.326 1.614-.978 2.133-.647.52-1.55.78-2.707.78-1.066 0-2.01-.201-2.83-.602V12.07c.675.3 1.244.513 1.71.636.468.123.897.184 1.284.184.465 0 .82-.088 1.067-.266.25-.178.376-.442.376-.793a.86.86 0 00-.164-.52 1.791 1.791 0 00-.486-.444c-.21-.141-.64-.367-1.292-.677-.61-.287-1.069-.563-1.374-.827a3.106 3.106 0 01-.731-.923c-.183-.35-.274-.76-.274-1.23 0-.884.299-1.58.896-2.085.601-.506 1.43-.759 2.488-.759.52 0 1.014.061 1.483.185.474.123.969.296 1.484.52l-.684 1.647a9.9 9.9 0 00-1.326-.458 4.215 4.215 0 00-1.025-.13c-.401 0-.709.093-.923.28a.924.924 0 00-.321.731c0 .187.043.351.13.493a1.5 1.5 0 00.41.403c.191.127.64.36 1.346.697.935.447 1.575.896 1.921 1.347.347.447.52.996.52 1.647zm7.036-5.598c-.797 0-1.415.3-1.852.902-.438.597-.656 1.431-.656 2.502 0 2.228.836 3.343 2.508 3.343.702 0 1.552-.176 2.55-.527v1.778c-.82.341-1.736.512-2.748.512-1.454 0-2.566-.44-3.336-1.319-.77-.884-1.155-2.15-1.155-3.8 0-1.04.19-1.949.567-2.728.379-.784.92-1.383 1.627-1.798.711-.42 1.543-.629 2.495-.629.971 0 1.946.235 2.926.704l-.683 1.723c-.374-.178-.75-.333-1.128-.465a3.367 3.367 0 00-1.115-.198zm11.781 8.374l-.724-2.38h-3.644l-.725 2.38h-2.283l3.528-10.035h2.59l3.541 10.035h-2.283zm-1.23-4.156A2039.46 2039.46 0 01-9.452 6.69a11.538 11.538 0 01-.178-.67c-.15.584-.58 2.026-1.292 4.328h2.605zm9.614 4.156h-2.12v-8.23h-2.713V4.51H4.01v1.763H1.297v8.23zm9.087 0h-2.12v-8.23H5.552V4.51h7.547v1.763h-2.714v8.23zm10.988 0h-5.756V4.51h5.756v1.736h-3.637V8.44h3.384v1.737h-3.384v2.577h3.637v1.75zm5.19-5.558h.684c.67 0 1.165-.112 1.484-.335.319-.223.478-.574.478-1.053 0-.474-.164-.81-.492-1.011-.324-.2-.827-.301-1.51-.301h-.643v2.7zm0 1.723v3.835h-2.118V4.51h2.912c1.358 0 2.363.248 3.014.745.652.492.978 1.242.978 2.249 0 .588-.162 1.112-.485 1.572-.324.456-.782.814-1.375 1.073a403.195 403.195 0 002.94 4.355h-2.352l-2.385-3.835h-1.128z"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(.18 -33.2)"
      ></path>
      <g
        clipPath="url(#CLIPPATH_77)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(.06 31.2)"
      >
        <clipPath id="CLIPPATH_77">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(0 -21.37)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-14.47-10.287l-34.2 20.578h68.844l28.488-20.578h-63.133z"
          opacity="0.9"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_78)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(5.19 25.16)"
      >
        <clipPath id="CLIPPATH_78">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-5.14 -15.33)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.002 3.235c1.773 0 3.21-1.448 3.21-3.235S1.775-3.236.002-3.236-3.208-1.787-3.208 0c0 1.787 1.437 3.235 3.21 3.235z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_79)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(-15.53 26.08)"
      >
        <clipPath id="CLIPPATH_79">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(15.58 -16.25)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.004 3.231c1.773 0 3.21-1.448 3.21-3.235S1.777-3.24.004-3.24s-3.21 1.449-3.21 3.236c0 1.787 1.437 3.235 3.21 3.235z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_80)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(10.49 31.86)"
      >
        <clipPath id="CLIPPATH_80">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-10.44 -22.03)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.004 3.233c1.772 0 3.21-1.448 3.21-3.235S1.776-3.238.004-3.238c-1.773 0-3.21 1.449-3.21 3.236 0 1.787 1.437 3.235 3.21 3.235z"
          opacity="0.8"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_81)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(-3.59 17.75)"
      >
        <clipPath id="CLIPPATH_81">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(3.65 -7.92)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.003 3.05c1.67 0 3.023-1.364 3.023-3.046 0-1.683-1.354-3.047-3.023-3.047-1.67 0-3.023 1.364-3.023 3.047 0 1.682 1.354 3.046 3.023 3.046z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_82)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(9.84 4.28)"
      >
        <clipPath id="CLIPPATH_82">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-9.79 5.55)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M0 3.043c1.67 0 3.023-1.365 3.023-3.047C3.023-1.686 1.67-3.05.001-3.05c-1.67 0-3.023 1.364-3.023 3.046 0 1.682 1.353 3.047 3.023 3.047z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_83)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(9.84 11.04)"
      >
        <clipPath id="CLIPPATH_83">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-9.79 -1.21)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M0 3.051c1.67 0 3.023-1.364 3.023-3.046 0-1.683-1.353-3.047-3.022-3.047-1.67 0-3.023 1.364-3.023 3.047 0 1.682 1.353 3.046 3.023 3.046z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_84)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(-28.24 11.43)"
      >
        <clipPath id="CLIPPATH_84">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(28.3 -1.6)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.001 3.048c1.669 0 3.022-1.364 3.022-3.046 0-1.683-1.353-3.047-3.022-3.047-1.67 0-3.023 1.364-3.023 3.047 0 1.682 1.354 3.046 3.023 3.046z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_85)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(22.42 2.55)"
      >
        <clipPath id="CLIPPATH_85">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-22.36 7.28)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.003 3.046C1.667 3.046 3.02 1.682 3.02 0c0-1.683-1.354-3.047-3.023-3.047-1.67 0-3.023 1.364-3.023 3.047 0 1.682 1.354 3.046 3.023 3.046z"
          opacity="0.9"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_86)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(8.5 -.47)"
      >
        <clipPath id="CLIPPATH_86">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-8.44 10.3)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.002 3.05c1.67 0 3.022-1.363 3.022-3.046 0-1.682-1.353-3.047-3.022-3.047-1.67 0-3.023 1.365-3.023 3.047 0 1.683 1.354 3.047 3.023 3.047z"
          opacity="0.9"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_87)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(6.48 -5.21)"
      >
        <clipPath id="CLIPPATH_87">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-6.43 15.04)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.002 3.051c1.67 0 3.023-1.364 3.023-3.046 0-1.683-1.354-3.047-3.023-3.047-1.67 0-3.023 1.364-3.023 3.047 0 1.682 1.354 3.046 3.023 3.046z"
          opacity="0.75"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_88)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(8.5 -8.59)"
      >
        <clipPath id="CLIPPATH_88">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-8.44 18.42)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.002 3.046c1.67 0 3.022-1.364 3.022-3.047 0-1.682-1.353-3.046-3.022-3.046-1.67 0-3.023 1.364-3.023 3.046 0 1.683 1.354 3.047 3.023 3.047z"
          opacity="0.75"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_89)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(11.86 -11.3)"
      >
        <clipPath id="CLIPPATH_89">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-11.8 21.13)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.003 3.048c1.67 0 3.023-1.364 3.023-3.046 0-1.683-1.354-3.047-3.023-3.047-1.67 0-3.023 1.364-3.023 3.047 0 1.682 1.354 3.046 3.023 3.046z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_90)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(-24.61 10.67)"
      >
        <clipPath id="CLIPPATH_90">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(24.67 -.84)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M0 3.051c1.669 0 3.022-1.364 3.022-3.047C3.022-1.678 1.67-3.042 0-3.042c-1.67 0-3.023 1.364-3.023 3.046 0 1.683 1.353 3.047 3.023 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_91)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(-15.96 5.71)"
      >
        <clipPath id="CLIPPATH_91">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(16.01 4.12)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.004 3.044c1.67 0 3.023-1.364 3.023-3.047 0-1.682-1.354-3.046-3.023-3.046-1.67 0-3.022 1.364-3.022 3.046 0 1.683 1.353 3.047 3.022 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_92)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(-13 -5.88)"
      >
        <clipPath id="CLIPPATH_92">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(13.06 15.71)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M0 3.046c1.67 0 3.023-1.365 3.023-3.047 0-1.682-1.354-3.046-3.023-3.046-1.67 0-3.023 1.364-3.023 3.046 0 1.682 1.354 3.047 3.023 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_93)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(-6.95 10.37)"
      >
        <clipPath id="CLIPPATH_93">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(7.01 -.54)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.005 3.046c1.67 0 3.023-1.365 3.023-3.047 0-1.682-1.353-3.046-3.023-3.046-1.669 0-3.022 1.364-3.022 3.046 0 1.682 1.353 3.047 3.022 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_94)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(-4.27 7.66)"
      >
        <clipPath id="CLIPPATH_94">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(4.32 2.17)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.004 3.046c1.67 0 3.023-1.364 3.023-3.047 0-1.682-1.354-3.046-3.023-3.046-1.67 0-3.023 1.364-3.023 3.046 0 1.683 1.354 3.047 3.023 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_95)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(-.24 7.66)"
      >
        <clipPath id="CLIPPATH_95">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(.29 2.17)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.004 3.046c1.669 0 3.022-1.364 3.022-3.047 0-1.682-1.353-3.046-3.022-3.046-1.67 0-3.023 1.364-3.023 3.046 0 1.683 1.353 3.047 3.023 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_96)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(-4.27 -11.3)"
      >
        <clipPath id="CLIPPATH_96">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(4.32 21.13)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.004 3.048c1.67 0 3.023-1.364 3.023-3.046 0-1.683-1.354-3.047-3.023-3.047-1.67 0-3.023 1.364-3.023 3.047 0 1.682 1.354 3.046 3.023 3.046z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_97)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(-6.47 18.12)"
      >
        <clipPath id="CLIPPATH_97">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(6.53 -8.29)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M0 3.048c1.67 0 3.023-1.364 3.023-3.047 0-1.682-1.353-3.046-3.022-3.046-1.67 0-3.023 1.364-3.023 3.046 0 1.683 1.353 3.047 3.023 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_98)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(-27.37 -5.16)"
      >
        <clipPath id="CLIPPATH_98">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(27.43 14.99)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.004 3.048C1.666 3.048 3.02 1.684 3.02 0c0-1.682-1.354-3.046-3.023-3.046-1.67 0-3.023 1.364-3.023 3.046 0 1.683 1.354 3.047 3.023 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_99)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(-10.55 -8.18)"
      >
        <clipPath id="CLIPPATH_99">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(10.61 18.01)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M0 3.05c1.67 0 3.023-1.364 3.023-3.047 0-1.682-1.354-3.046-3.023-3.046-1.67 0-3.023 1.364-3.023 3.046C-3.023 1.686-1.669 3.05 0 3.05z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_100)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(-27.97 -8.29)"
      >
        <clipPath id="CLIPPATH_100">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(28.03 18.12)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M0 3.051c1.67 0 3.023-1.364 3.023-3.046 0-1.683-1.353-3.047-3.022-3.047-1.67 0-3.023 1.364-3.023 3.046 0 1.683 1.353 3.047 3.023 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_101)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(6.48 22.56)"
      >
        <clipPath id="CLIPPATH_101">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-6.43 -12.72)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.002 3.042c1.67 0 3.023-1.364 3.023-3.047C3.025-1.687 1.67-3.05.002-3.05c-1.67 0-3.023 1.364-3.023 3.046 0 1.683 1.354 3.047 3.023 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_102)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(28.75 5.68)"
      >
        <clipPath id="CLIPPATH_102">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-28.69 4.15)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.003 3.043c1.67 0 3.023-1.364 3.023-3.047 0-1.682-1.353-3.046-3.023-3.046-1.669 0-3.022 1.364-3.022 3.046 0 1.683 1.353 3.047 3.022 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_103)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(37.48 .26)"
      >
        <clipPath id="CLIPPATH_103">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-37.43 9.57)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.002 3.045C1.67 3.045 3.024 1.681 3.024 0c0-1.683-1.353-3.047-3.022-3.047-1.67 0-3.023 1.364-3.023 3.047 0 1.682 1.353 3.046 3.023 3.046z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_104)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(15.79 -6.88)"
      >
        <clipPath id="CLIPPATH_104">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-15.73 16.71)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.004 3.049c1.67 0 3.023-1.364 3.023-3.046 0-1.683-1.354-3.047-3.023-3.047-1.67 0-3.023 1.364-3.023 3.047 0 1.682 1.354 3.046 3.023 3.046z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_105)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(28.46 8.64)"
      >
        <clipPath id="CLIPPATH_105">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-28.41 1.19)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.005 3.049c1.67 0 3.023-1.364 3.023-3.047 0-1.682-1.354-3.046-3.023-3.046-1.67 0-3.023 1.364-3.023 3.046 0 1.683 1.354 3.047 3.023 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_106)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(13.77 3.28)"
      >
        <clipPath id="CLIPPATH_106">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-13.72 6.55)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.003 3.046c1.669 0 3.022-1.364 3.022-3.047 0-1.682-1.353-3.046-3.022-3.046-1.67 0-3.023 1.364-3.023 3.046 0 1.683 1.353 3.047 3.023 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_107)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(5.44 14.08)"
      >
        <clipPath id="CLIPPATH_107">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-5.39 -4.25)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.002 3.045c1.669 0 3.022-1.364 3.022-3.047 0-1.682-1.353-3.046-3.022-3.046-1.67 0-3.023 1.364-3.023 3.046 0 1.683 1.353 3.047 3.023 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_108)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(8.13 16.79)"
      >
        <clipPath id="CLIPPATH_108">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-8.07 -6.96)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.002 3.045c1.67 0 3.023-1.364 3.023-3.047 0-1.682-1.354-3.046-3.023-3.046-1.67 0-3.023 1.364-3.023 3.046 0 1.683 1.354 3.047 3.023 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_109)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(23.1 13.78)"
      >
        <clipPath id="CLIPPATH_109">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-23.04 -3.94)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.002 3.042c1.669 0 3.022-1.364 3.022-3.047 0-1.682-1.353-3.046-3.022-3.046-1.67 0-3.023 1.364-3.023 3.046 0 1.683 1.353 3.047 3.023 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_110)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(25.78 11.07)"
      >
        <clipPath id="CLIPPATH_110">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-25.73 -1.23)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M.004 3.042c1.669 0 3.022-1.364 3.022-3.047 0-1.682-1.353-3.046-3.022-3.046-1.67 0-3.023 1.364-3.023 3.046 0 1.683 1.353 3.047 3.023 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_111)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(29.82 11.07)"
      >
        <clipPath id="CLIPPATH_111">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-29.76 -1.23)"
          ></rect>
        </clipPath>
        <path
          fill="#7B61FF"
          d="M-.004 3.042c1.669 0 3.022-1.364 3.022-3.047 0-1.682-1.353-3.046-3.022-3.046-1.67 0-3.023 1.364-3.023 3.046 0 1.683 1.353 3.047 3.023 3.047z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_112)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(23.58 21.53)"
      >
        <clipPath id="CLIPPATH_112">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(-23.52 -11.7)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M0 3.044c1.67 0 3.023-1.364 3.023-3.046C3.023-1.685 1.67-3.05 0-3.05c-1.669 0-3.022 1.364-3.022 3.047C-3.022 1.68-1.67 3.044 0 3.044z"
          opacity="0.59"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_113)"
        transform="matrix(1.86 0 0 1.86 112.63 113.63) translate(-17.92 23.94)"
      >
        <clipPath id="CLIPPATH_113">
          <rect
            width="97.332"
            height="62.639"
            x="-48.666"
            y="-31.32"
            rx="0"
            ry="0"
            transform="translate(17.98 -14.11)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M-.001 3.233c1.773 0 3.21-1.449 3.21-3.236 0-1.787-1.437-3.235-3.21-3.235s-3.21 1.448-3.21 3.235 1.437 3.236 3.21 3.236z"
          opacity="0.8"
        ></path>
      </g>
    </svg>
  );
};

export default Scatter3D;
