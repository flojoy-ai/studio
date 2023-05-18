import { useMantineTheme } from "@mantine/core";

const LineChart = () => {
  const theme = useMantineTheme();
  if (theme.colorScheme === "dark") {
    return <LineChartDark />;
  }
  return <LineChartLight />;
};

const LineChartDark = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="225"
      height="226"
      viewBox="0 0 225 226"
      data-testid="line-svg"
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
        d="M-59.81-54.694a5.5 5.5 0 015.5-5.5H54.309a5.5 5.5 0 015.5 5.5V54.693a5.5 5.5 0 01-5.5 5.5H-54.31a5.5 5.5 0 01-5.5-5.5V-54.694z"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(-.19 -.3)"
      ></path>
      <g
        clipPath="url(#CLIPPATH_190)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(-.24 18.26)"
      >
        <clipPath id="CLIPPATH_190">
          <rect
            width="95.53"
            height="43.423"
            x="-47.765"
            y="-21.711"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 .05 -5.43)"
          ></rect>
        </clipPath>
        <path
          fill="none"
          stroke="#99F5FF"
          strokeMiterlimit="10"
          d="M47.589-14.733L33.564-5.202 20.066-15.11 6.568-1.937-6.93-15.998l-13.499 29.03-13.498-5.712-13.657 8.675"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_191)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(-.11 6.7)"
      >
        <clipPath id="CLIPPATH_191">
          <rect
            width="95.53"
            height="43.423"
            x="-47.765"
            y="-21.711"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 -.08 6.12)"
          ></rect>
        </clipPath>
        <path
          fill="none"
          stroke="#FFF"
          strokeMiterlimit="10"
          d="M47.459-12.143L33.434 11.852 19.937 4.748l-13.498 9.18-13.498 1.483L-20.56.008l-13.498 6.216L-47.462-15.4"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_192)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(-34.17 25.58)"
      >
        <clipPath id="CLIPPATH_192">
          <rect
            width="95.53"
            height="43.423"
            x="-47.765"
            y="-21.711"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 33.98 -12.75)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.914 0c0 .581-.406 1.06-.91 1.06-.506 0-.911-.473-.911-1.06 0-.588.405-1.06.91-1.06s.91.472.91 1.06z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_193)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(-34.17 12.8)"
      >
        <clipPath id="CLIPPATH_193">
          <rect
            width="95.53"
            height="43.423"
            x="-47.765"
            y="-21.711"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 33.98 .03)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.914-.004c0 .582-.406 1.06-.91 1.06-.506 0-.911-.472-.911-1.06 0-.587.405-1.06.91-1.06s.91.473.91 1.06z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_194)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(-20.67 31.16)"
      >
        <clipPath id="CLIPPATH_194">
          <rect
            width="95.53"
            height="43.423"
            x="-47.765"
            y="-21.711"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 20.48 -18.34)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.912.003c0 .582-.406 1.06-.91 1.06-.505 0-.911-.472-.911-1.06 0-.588.406-1.06.91-1.06.505 0 .91.472.91 1.06z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_195)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(-20.67 6.8)"
      >
        <clipPath id="CLIPPATH_195">
          <rect
            width="95.53"
            height="43.423"
            x="-47.765"
            y="-21.711"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 20.48 6.03)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.001-1.063c.503 0 .91.475.91 1.06 0 .586-.407 1.06-.91 1.06-.503 0-.91-.474-.91-1.06 0-.585.407-1.06.91-1.06z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_196)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(-7.17 2.41)"
      >
        <clipPath id="CLIPPATH_196">
          <rect
            width="95.53"
            height="43.423"
            x="-47.765"
            y="-21.711"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 6.98 10.41)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.91.005c0 .581-.406 1.06-.91 1.06-.505 0-.91-.472-.91-1.06 0-.588.405-1.06.91-1.06.504 0 .91.472.91 1.06z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_197)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(-7.17 22.04)"
      >
        <clipPath id="CLIPPATH_197">
          <rect
            width="95.53"
            height="43.423"
            x="-47.765"
            y="-21.711"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 6.98 -9.22)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.91 0C.91.582.504 1.06 0 1.06-.505 1.06-.91.589-.91 0c0-.587.405-1.06.91-1.06.504 0 .91.473.91 1.06z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_198)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(6.38 16.22)"
      >
        <clipPath id="CLIPPATH_198">
          <rect
            width="95.53"
            height="43.423"
            x="-47.765"
            y="-21.711"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 -6.57 -3.4)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.913 0c0 .582-.406 1.061-.91 1.061-.505 0-.91-.473-.91-1.06 0-.588.405-1.061.91-1.061.504 0 .91.473.91 1.06z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_199)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(6.38 20.54)"
      >
        <clipPath id="CLIPPATH_199">
          <rect
            width="95.53"
            height="43.423"
            x="-47.765"
            y="-21.711"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 -6.57 -7.71)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.913 0c0 .58-.406 1.06-.91 1.06-.505 0-.91-.473-.91-1.06 0-.589.405-1.061.91-1.061.504 0 .91.472.91 1.06z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_200)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(19.83 3.32)"
      >
        <clipPath id="CLIPPATH_200">
          <rect
            width="95.53"
            height="43.423"
            x="-47.765"
            y="-21.711"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 -20.02 9.51)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.907-.004c0 .581-.406 1.06-.91 1.06-.505 0-.911-.472-.911-1.06 0-.588.406-1.06.91-1.06.505 0 .91.472.91 1.06z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_201)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(19.83 11.47)"
      >
        <clipPath id="CLIPPATH_201">
          <rect
            width="95.53"
            height="43.423"
            x="-47.765"
            y="-21.711"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 -20.02 1.35)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.907.004c0 .581-.406 1.06-.91 1.06-.505 0-.911-.472-.911-1.06 0-.588.406-1.06.91-1.06.505 0 .91.472.91 1.06z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_202)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(33.38 12.92)"
      >
        <clipPath id="CLIPPATH_202">
          <rect
            width="95.53"
            height="43.423"
            x="-47.765"
            y="-21.711"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 -33.57 -.09)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.91-.002c0 .581-.406 1.06-.91 1.06-.505 0-.911-.473-.911-1.06 0-.588.406-1.06.91-1.06.505 0 .91.472.91 1.06z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_203)"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(33.38 18.44)"
      >
        <clipPath id="CLIPPATH_203">
          <rect
            width="95.53"
            height="43.423"
            x="-47.765"
            y="-21.711"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 -33.57 -5.61)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.91-.003C.91.58.504 1.057 0 1.057c-.505 0-.911-.472-.911-1.06 0-.587.406-1.06.91-1.06.505 0 .91.473.91 1.06z"
        ></path>
      </g>
      <path
        fill="#99F5FF"
        d="M-16.32 4.995v-9.994h2.12v8.244h4.054v1.75h-6.173zm8.897 0v-9.994h2.119v9.994h-2.12zm14.48 0H4.365L.017-2.565h-.062C.042-1.23.085-.277.085.292v4.703h-1.893v-9.994H.864l4.341 7.486h.048c-.068-1.3-.102-2.217-.102-2.755v-4.73h1.907v9.993zm9.26 0H10.56v-9.994h5.756v1.737H12.68v2.194h3.384V.668H12.68v2.577h3.637v1.75z"
        transform="matrix(1.87 0 0 1.87 112.91 113.34) translate(-.17 -33.66)"
      ></path>
    </svg>
  );
};

const LineChartLight = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="225"
      height="226"
      viewBox="0 0 225 226"
      data-testid="line-svg"
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
        d="M-59.73-54.61a5.5 5.5 0 015.5-5.5H54.23a5.5 5.5 0 015.5 5.5V54.616a5.5 5.5 0 01-5.5 5.5H-54.23a5.5 5.5 0 01-5.5-5.5V-54.611z"
        transform="matrix(1.85 0 0 1.86 112.7 113.5) translate(-.27 -.1)"
      ></path>
      <g
        clipPath="url(#CLIPPATH_175)"
        transform="matrix(1.85 0 0 1.86 112.7 113.5) translate(-.32 18.44)"
      >
        <clipPath id="CLIPPATH_175">
          <rect
            width="95.404"
            height="43.366"
            x="-47.702"
            y="-21.683"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 .05 -5.43)"
          ></rect>
        </clipPath>
        <path
          fill="none"
          stroke="#7B61FF"
          strokeMiterlimit="10"
          d="M47.527-14.715L33.521-5.196l-13.48-9.896L6.56-1.936-6.92-15.98-20.4 13.013l-13.482-5.704-13.639 8.664"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_176)"
        transform="matrix(1.85 0 0 1.86 112.7 113.5) translate(-.19 6.9)"
      >
        <clipPath id="CLIPPATH_176">
          <rect
            width="95.404"
            height="43.366"
            x="-47.702"
            y="-21.683"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 -.08 6.11)"
          ></rect>
        </clipPath>
        <path
          fill="none"
          stroke="#FFF"
          strokeMiterlimit="10"
          d="M47.398-12.133L33.391 11.83l-13.48-7.094-13.48 9.168-13.481 1.48L-20.53.002-34.012 6.21-47.4-15.387"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_177)"
        transform="matrix(1.85 0 0 1.86 112.7 113.5) translate(-34.2 25.75)"
      >
        <clipPath id="CLIPPATH_177">
          <rect
            width="95.404"
            height="43.366"
            x="-47.702"
            y="-21.683"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 33.93 -12.74)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.908-.001c0 .58-.405 1.059-.91 1.059-.503 0-.909-.472-.909-1.06 0-.586.406-1.058.91-1.058s.909.472.909 1.059z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_178)"
        transform="matrix(1.85 0 0 1.86 112.7 113.5) translate(-34.2 12.98)"
      >
        <clipPath id="CLIPPATH_178">
          <rect
            width="95.404"
            height="43.366"
            x="-47.702"
            y="-21.683"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 33.93 .03)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.908.002c0 .58-.405 1.06-.91 1.06-.503 0-.909-.473-.909-1.06 0-.587.406-1.059.91-1.059s.909.472.909 1.06z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_179)"
        transform="matrix(1.85 0 0 1.86 112.7 113.5) translate(-20.72 31.32)"
      >
        <clipPath id="CLIPPATH_179">
          <rect
            width="95.404"
            height="43.366"
            x="-47.702"
            y="-21.683"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 20.45 -18.31)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.908.005C.908.585.503 1.064 0 1.064S-.91.592-.91.004c0-.586.406-1.058.91-1.058S.91-.582.91.005z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_180)"
        transform="matrix(1.85 0 0 1.86 112.7 113.5) translate(-20.72 6.99)"
      >
        <clipPath id="CLIPPATH_180">
          <rect
            width="95.404"
            height="43.366"
            x="-47.702"
            y="-21.683"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 20.45 6.02)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M0-1.058c.501 0 .908.474.908 1.06C.908.585.501 1.06 0 1.06S-.91.586-.91.001s.408-1.059.91-1.059z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_181)"
        transform="matrix(1.85 0 0 1.86 112.7 113.5) translate(-7.24 2.61)"
      >
        <clipPath id="CLIPPATH_181">
          <rect
            width="95.404"
            height="43.366"
            x="-47.702"
            y="-21.683"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 6.97 10.4)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.909.005c0 .58-.405 1.059-.91 1.059-.503 0-.909-.473-.909-1.06 0-.586.406-1.059.91-1.059s.909.473.909 1.06z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_182)"
        transform="matrix(1.85 0 0 1.86 112.7 113.5) translate(-7.24 22.21)"
      >
        <clipPath id="CLIPPATH_182">
          <rect
            width="95.404"
            height="43.366"
            x="-47.702"
            y="-21.683"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 6.97 -9.2)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.909.004c0 .58-.405 1.06-.91 1.06-.503 0-.909-.473-.909-1.06 0-.587.406-1.059.91-1.059s.909.472.909 1.06z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_183)"
        transform="matrix(1.85 0 0 1.86 112.7 113.5) translate(6.3 16.4)"
      >
        <clipPath id="CLIPPATH_183">
          <rect
            width="95.404"
            height="43.366"
            x="-47.702"
            y="-21.683"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 -6.57 -3.39)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.904.002C.904.582.5 1.06-.005 1.06S-.915.589-.915 0c0-.586.406-1.058.91-1.058s.91.472.91 1.059z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_184)"
        transform="matrix(1.85 0 0 1.86 112.7 113.5) translate(6.3 20.71)"
      >
        <clipPath id="CLIPPATH_184">
          <rect
            width="95.404"
            height="43.366"
            x="-47.702"
            y="-21.683"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 -6.57 -7.7)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.904.005c0 .58-.405 1.059-.909 1.059s-.91-.472-.91-1.06c0-.586.406-1.058.91-1.058s.91.472.91 1.059z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_185)"
        transform="matrix(1.85 0 0 1.86 112.7 113.5) translate(19.72 3.51)"
      >
        <clipPath id="CLIPPATH_185">
          <rect
            width="95.404"
            height="43.366"
            x="-47.702"
            y="-21.683"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 -19.99 9.5)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.91.004C.91.584.505 1.063 0 1.063c-.503 0-.909-.472-.909-1.06 0-.586.406-1.058.91-1.058S.91-.583.91.004z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_186)"
        transform="matrix(1.85 0 0 1.86 112.7 113.5) translate(19.72 11.66)"
      >
        <clipPath id="CLIPPATH_186">
          <rect
            width="95.404"
            height="43.366"
            x="-47.702"
            y="-21.683"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 -19.99 1.35)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.91.001c0 .581-.405 1.06-.91 1.06-.503 0-.909-.473-.909-1.06 0-.587.406-1.059.91-1.059s.91.472.91 1.06z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_187)"
        transform="matrix(1.85 0 0 1.86 112.7 113.5) translate(33.26 13.1)"
      >
        <clipPath id="CLIPPATH_187">
          <rect
            width="95.404"
            height="43.366"
            x="-47.702"
            y="-21.683"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 -33.53 -.09)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.905.003c0 .58-.405 1.06-.909 1.06S-.914.59-.914.002c0-.587.406-1.059.91-1.059s.91.472.91 1.06z"
        ></path>
      </g>
      <g
        clipPath="url(#CLIPPATH_188)"
        transform="matrix(1.85 0 0 1.86 112.7 113.5) translate(33.26 18.62)"
      >
        <clipPath id="CLIPPATH_188">
          <rect
            width="95.404"
            height="43.366"
            x="-47.702"
            y="-21.683"
            rx="0"
            ry="0"
            transform="matrix(1 0 0 -1 -33.53 -5.6)"
          ></rect>
        </clipPath>
        <path
          fill="#FFF"
          d="M.905-.004c0 .58-.405 1.059-.909 1.059s-.91-.472-.91-1.06c0-.586.406-1.058.91-1.058s.91.472.91 1.059z"
        ></path>
      </g>
      <path
        fill="#7B61FF"
        d="M-16.318 4.993v-9.994h2.119v8.244h4.054v1.75h-6.173zm8.896 0v-9.994h2.119v9.994h-2.12zm14.48 0H4.366L.018-2.567h-.062C.043-1.233.086-.28.086.29v4.703h-1.893v-9.994H.865l4.341 7.485h.048C5.186 1.185 5.152.267 5.152-.27V-5h1.907v9.994zm9.26 0H10.56v-9.994h5.756v1.736H12.68v2.194h3.384V.666H12.68v2.577h3.637v1.75z"
        transform="matrix(1.85 0 0 1.86 112.7 113.5) translate(-.25 -33.4)"
      ></path>
    </svg>
  );
};

export default LineChart;
