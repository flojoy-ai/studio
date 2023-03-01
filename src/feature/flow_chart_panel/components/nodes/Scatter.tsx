import { CSSProperties, Fragment } from "react";

interface SvgProps {
  style?: CSSProperties;
  theme?: "light" | "dark";
}
const ScatterTitle = ({ style, theme }: SvgProps) => {
  if (theme === "light") {
    return (
      <svg
        style={style}
        width="94"
        height="16"
        viewBox="0 0 94 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.95731 11.1501C9.95731 11.9965 9.75223 12.7322 9.34207 13.3572C8.93192 13.9822 8.33296 14.4639 7.5452 14.8025C6.76395 15.141 5.81343 15.3103 4.69363 15.3103C4.19884 15.3103 3.71382 15.2778 3.23856 15.2126C2.76981 15.1475 2.31733 15.0531 1.88113 14.9294C1.45145 14.7992 1.04129 14.6397 0.650665 14.4509V11.6384C1.32775 11.9379 2.03087 12.2081 2.76004 12.449C3.48921 12.6899 4.21186 12.8103 4.92801 12.8103C5.4228 12.8103 5.81994 12.7452 6.11942 12.615C6.4254 12.4848 6.64676 12.3057 6.78348 12.0779C6.9202 11.85 6.98856 11.5896 6.98856 11.2966C6.98856 10.9386 6.86811 10.6326 6.62723 10.3787C6.38634 10.1248 6.05431 9.88713 5.63113 9.66577C5.21447 9.44442 4.74246 9.20679 4.21512 8.95288C3.88309 8.79663 3.52176 8.60783 3.13113 8.38647C2.74051 8.15861 2.36942 7.88192 2.01785 7.5564C1.66629 7.23088 1.37658 6.837 1.14871 6.37476C0.927358 5.90601 0.816681 5.34611 0.816681 4.69507C0.816681 3.8422 1.01199 3.11304 1.40262 2.50757C1.79324 1.9021 2.34988 1.43986 3.07254 1.12085C3.80171 0.795329 4.66108 0.632568 5.65067 0.632568C6.39285 0.632568 7.09923 0.720459 7.76981 0.89624C8.44689 1.06551 9.15327 1.31291 9.88895 1.63843L8.91238 3.99194C8.25483 3.72502 7.66564 3.51994 7.14481 3.37671C6.62397 3.22697 6.09337 3.1521 5.55301 3.1521C5.1754 3.1521 4.85314 3.21395 4.58621 3.33765C4.31929 3.45483 4.11746 3.6241 3.98074 3.84546C3.84402 4.0603 3.77567 4.31095 3.77567 4.59741C3.77567 4.93595 3.87332 5.22241 4.06863 5.45679C4.27046 5.68465 4.56994 5.90601 4.96707 6.12085C5.37072 6.33569 5.87202 6.58634 6.47098 6.8728C7.20014 7.21785 7.82189 7.57918 8.33621 7.95679C8.85705 8.32788 9.25744 8.76733 9.53738 9.27515C9.81733 9.77645 9.95731 10.4014 9.95731 11.1501ZM20.0096 3.1521C19.4302 3.1521 18.9159 3.26603 18.4667 3.4939C18.024 3.71525 17.6496 4.03752 17.3436 4.46069C17.0442 4.88387 16.8163 5.39494 16.66 5.9939C16.5038 6.59285 16.4257 7.26668 16.4257 8.01538C16.4257 9.0245 16.5494 9.88713 16.7968 10.6033C17.0507 11.3129 17.4413 11.8565 17.9686 12.2341C18.496 12.6052 19.1763 12.7908 20.0096 12.7908C20.5891 12.7908 21.1685 12.7257 21.7479 12.5955C22.3339 12.4653 22.9686 12.2797 23.6522 12.0388V14.5779C23.0207 14.8383 22.399 15.0238 21.787 15.1345C21.175 15.2517 20.4882 15.3103 19.7264 15.3103C18.2551 15.3103 17.0442 15.0076 16.0936 14.4021C15.1496 13.7901 14.4498 12.9373 13.994 11.8435C13.5383 10.7432 13.3104 9.46069 13.3104 7.99585C13.3104 6.91512 13.4569 5.92554 13.7499 5.0271C14.0429 4.12866 14.4725 3.35067 15.0389 2.69312C15.6054 2.03556 16.3052 1.52775 17.1386 1.16968C17.9719 0.811605 18.9289 0.632568 20.0096 0.632568C20.7193 0.632568 21.4289 0.723714 22.1386 0.906006C22.8547 1.08179 23.5383 1.32593 24.1893 1.63843L23.2128 4.09937C22.6789 3.84546 22.1418 3.6241 21.6014 3.4353C21.0611 3.2465 20.5305 3.1521 20.0096 3.1521ZM36.8393 15.115L35.8042 11.7166H30.5991L29.5639 15.115H26.3022L31.3413 0.779053H35.0425L40.1011 15.115H36.8393ZM35.0815 9.17749L34.0464 5.85718C33.9813 5.63582 33.8934 5.35262 33.7827 5.00757C33.6785 4.65601 33.5711 4.30119 33.4604 3.94312C33.3563 3.57853 33.2716 3.26278 33.2065 2.99585C33.1414 3.26278 33.0503 3.59481 32.9331 3.99194C32.8224 4.38257 32.715 4.75366 32.6108 5.10522C32.5067 5.45679 32.4318 5.70744 32.3862 5.85718L31.3608 9.17749H35.0815ZM48.8155 15.115H45.7882V3.35718H41.9112V0.837646H52.6925V3.35718H48.8155V15.115ZM61.7975 15.115H58.7702V3.35718H54.8932V0.837646H65.6745V3.35718H61.7975V15.115ZM77.4944 15.115H69.2718V0.837646H77.4944V3.31812H72.2991V6.45288H77.1331V8.93335H72.2991V12.615H77.4944V15.115ZM86.0429 0.837646C87.3384 0.837646 88.4061 0.993896 89.246 1.3064C90.0923 1.6189 90.7206 2.0909 91.1307 2.72241C91.5409 3.35392 91.746 4.15145 91.746 5.11499C91.746 5.76603 91.6223 6.33569 91.3749 6.82397C91.1275 7.31226 90.802 7.72567 90.3983 8.06421C89.9947 8.40275 89.5585 8.67944 89.0897 8.89429L93.2889 15.115H89.9296L86.5214 9.63647H84.91V15.115H81.8827V0.837646H86.0429ZM85.828 3.31812H84.91V7.17554H85.8866C86.8892 7.17554 87.6054 7.00952 88.035 6.67749C88.4712 6.33895 88.6893 5.84416 88.6893 5.19312C88.6893 4.51603 88.455 4.03426 87.9862 3.7478C87.524 3.46134 86.8046 3.31812 85.828 3.31812Z"
          fill="#7B61FF"
        />
      </svg>
    );
  }
  return (
    <svg
      style={style}
      width="93"
      height="16"
      viewBox="0 0 93 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.58013 11.2223C9.58013 12.0687 9.37505 12.8044 8.96489 13.4294C8.55474 14.0544 7.95578 14.5361 7.16802 14.8747C6.38677 15.2132 5.43625 15.3825 4.31646 15.3825C3.82166 15.3825 3.33664 15.3499 2.86138 15.2848C2.39263 15.2197 1.94015 15.1253 1.50396 15.0016C1.07427 14.8714 0.664112 14.7119 0.273487 14.5231V11.7106C0.95057 12.0101 1.6537 12.2803 2.38286 12.5212C3.11203 12.762 3.83469 12.8825 4.55083 12.8825C5.04562 12.8825 5.44276 12.8174 5.74224 12.6872C6.04823 12.557 6.26958 12.3779 6.4063 12.1501C6.54302 11.9222 6.61138 11.6618 6.61138 11.3688C6.61138 11.0107 6.49094 10.7048 6.25005 10.4509C6.00916 10.1969 5.67713 9.95931 5.25396 9.73796C4.83729 9.51661 4.36528 9.27898 3.83794 9.02507C3.50591 8.86882 3.14458 8.68002 2.75396 8.45866C2.36333 8.2308 1.99224 7.95411 1.64067 7.62859C1.28911 7.30306 0.999399 6.90918 0.771534 6.44695C0.55018 5.9782 0.439503 5.4183 0.439503 4.76726C0.439503 3.91439 0.634815 3.18523 1.02544 2.57976C1.41607 1.97429 1.97271 1.51205 2.69536 1.19304C3.42453 0.867518 4.2839 0.704758 5.27349 0.704758C6.01567 0.704758 6.72205 0.792648 7.39263 0.96843C8.06971 1.1377 8.77609 1.3851 9.51177 1.71062L8.53521 4.06413C7.87765 3.79721 7.28846 3.59213 6.76763 3.4489C6.24679 3.29916 5.7162 3.22429 5.17583 3.22429C4.79823 3.22429 4.47596 3.28614 4.20903 3.40984C3.94211 3.52702 3.74028 3.69629 3.60357 3.91765C3.46685 4.13249 3.39849 4.38314 3.39849 4.6696C3.39849 5.00814 3.49614 5.2946 3.69146 5.52898C3.89328 5.75684 4.19276 5.9782 4.58989 6.19304C4.99354 6.40788 5.49484 6.65853 6.0938 6.94499C6.82297 7.29004 7.44471 7.65137 7.95903 8.02898C8.47987 8.40007 8.88026 8.83952 9.16021 9.34734C9.44015 9.84864 9.58013 10.4736 9.58013 11.2223ZM19.6325 3.22429C19.053 3.22429 18.5387 3.33822 18.0895 3.56609C17.6468 3.78744 17.2724 4.10971 16.9665 4.53288C16.667 4.95606 16.4391 5.46713 16.2829 6.06609C16.1266 6.66504 16.0485 7.33887 16.0485 8.08757C16.0485 9.09668 16.1722 9.95931 16.4196 10.6755C16.6735 11.3851 17.0641 11.9287 17.5915 12.3063C18.1188 12.6774 18.7991 12.863 19.6325 12.863C20.2119 12.863 20.7913 12.7979 21.3708 12.6676C21.9567 12.5374 22.5915 12.3519 23.275 12.111V14.6501C22.6435 14.9105 22.0218 15.096 21.4098 15.2067C20.7978 15.3239 20.111 15.3825 19.3493 15.3825C17.8779 15.3825 16.667 15.0798 15.7165 14.4743C14.7724 13.8623 14.0726 13.0094 13.6168 11.9157C13.1611 10.8154 12.9333 9.53288 12.9333 8.06804C12.9333 6.98731 13.0797 5.99773 13.3727 5.09929C13.6657 4.20085 14.0954 3.42286 14.6618 2.7653C15.2282 2.10775 15.928 1.59994 16.7614 1.24187C17.5947 0.883794 18.5517 0.704758 19.6325 0.704758C20.3421 0.704758 21.0517 0.795904 21.7614 0.978195C22.4775 1.15398 23.1611 1.39812 23.8122 1.71062L22.8356 4.17155C22.3017 3.91765 21.7646 3.69629 21.2243 3.50749C20.6839 3.31869 20.1533 3.22429 19.6325 3.22429ZM36.4622 15.1872L35.427 11.7887H30.2219L29.1868 15.1872H25.925L30.9641 0.851242H34.6653L39.7239 15.1872H36.4622ZM34.7043 9.24968L33.6692 5.92937C33.6041 5.70801 33.5162 5.42481 33.4055 5.07976C33.3014 4.7282 33.1939 4.37338 33.0833 4.0153C32.9791 3.65072 32.8944 3.33497 32.8293 3.06804C32.7642 3.33497 32.6731 3.667 32.5559 4.06413C32.4452 4.45476 32.3378 4.82585 32.2336 5.17741C32.1295 5.52898 32.0546 5.77963 32.009 5.92937L30.9836 9.24968H34.7043ZM48.4383 15.1872H45.411V3.42937H41.534V0.909836H52.3153V3.42937H48.4383V15.1872ZM61.4204 15.1872H58.393V3.42937H54.5161V0.909836H65.2973V3.42937H61.4204V15.1872ZM77.1172 15.1872H68.8946V0.909836H77.1172V3.3903H71.9219V6.52507H76.7559V9.00554H71.9219V12.6872H77.1172V15.1872ZM85.6657 0.909836C86.9613 0.909836 88.029 1.06609 88.8688 1.37859C89.7152 1.69109 90.3434 2.16309 90.7536 2.7946C91.1637 3.42611 91.3688 4.22364 91.3688 5.18718C91.3688 5.83822 91.2451 6.40788 90.9977 6.89616C90.7503 7.38445 90.4248 7.79786 90.0211 8.1364C89.6175 8.47494 89.1813 8.75163 88.7126 8.96648L92.9118 15.1872H89.5524L86.1442 9.70866H84.5329V15.1872H81.5055V0.909836H85.6657ZM85.4508 3.3903H84.5329V7.24773H85.5094C86.512 7.24773 87.2282 7.08171 87.6579 6.74968C88.0941 6.41114 88.3122 5.91635 88.3122 5.2653C88.3122 4.58822 88.0778 4.10645 87.609 3.81999C87.1468 3.53353 86.4274 3.3903 85.4508 3.3903Z"
        fill="#99F5FF"
      />
    </svg>
  );
};

const ScatterBubbles = ({ style, theme }: SvgProps) => {
  if (theme === "light") {
    return (
      <svg
        style={style}
        width="154"
        height="87"
        viewBox="0 0 154 87"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_15_1623)">
          <path
            d="M88.1981 59.5588C91.2845 59.5588 93.7865 57.0551 93.7865 53.9666C93.7865 50.8781 91.2845 48.3744 88.1981 48.3744C85.1117 48.3744 82.6097 50.8781 82.6097 53.9666C82.6097 57.0551 85.1117 59.5588 88.1981 59.5588Z"
            fill="#7B61FF"
          />
          <path
            d="M96.8911 53.3452C99.9775 53.3452 102.479 50.8415 102.479 47.753C102.479 44.6645 99.9775 42.1608 96.8911 42.1608C93.8047 42.1608 91.3027 44.6645 91.3027 47.753C91.3027 50.8415 93.8047 53.3452 96.8911 53.3452Z"
            fill="#7B61FF"
          />
          <path
            d="M96.8911 65.7723C99.9775 65.7723 102.479 63.2686 102.479 60.1801C102.479 57.0916 99.9775 54.5879 96.8911 54.5879C93.8047 54.5879 91.3027 57.0916 91.3027 60.1801C91.3027 63.2686 93.8047 65.7723 96.8911 65.7723Z"
            fill="#7B61FF"
          />
          <path
            d="M101.859 65.7723C104.945 65.7723 107.447 63.2686 107.447 60.1801C107.447 57.0916 104.945 54.5879 101.859 54.5879C98.7721 54.5879 96.2701 57.0916 96.2701 60.1801C96.2701 63.2686 98.7721 65.7723 101.859 65.7723Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.9"
            d="M120.139 50.1763C123.225 50.1763 125.727 47.6726 125.727 44.5841C125.727 41.4956 123.225 38.9919 120.139 38.9919C117.052 38.9919 114.55 41.4956 114.55 44.5841C114.55 47.6726 117.052 50.1763 120.139 50.1763Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.9"
            d="M94.4075 44.6462C97.4938 44.6462 99.9958 42.1425 99.9958 39.054C99.9958 35.9656 97.4938 33.4619 94.4075 33.4619C91.3211 33.4619 88.8191 35.9656 88.8191 39.054C88.8191 42.1425 91.3211 44.6462 94.4075 44.6462Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.75"
            d="M90.6819 35.9473C93.7682 35.9473 96.2702 33.4436 96.2702 30.3551C96.2702 27.2666 93.7682 24.7629 90.6819 24.7629C87.5955 24.7629 85.0935 27.2666 85.0935 30.3551C85.0935 33.4436 87.5955 35.9473 90.6819 35.9473Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.75"
            d="M94.4075 29.7337C97.4938 29.7337 99.9958 27.23 99.9958 24.1415C99.9958 21.053 97.4938 18.5493 94.4075 18.5493C91.3211 18.5493 88.8191 21.053 88.8191 24.1415C88.8191 27.23 91.3211 29.7337 94.4075 29.7337Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M100.617 24.7629C103.703 24.7629 106.205 22.2592 106.205 19.1707C106.205 16.0822 103.703 13.5785 100.617 13.5785C97.5303 13.5785 95.0283 16.0822 95.0283 19.1707C95.0283 22.2592 97.5303 24.7629 100.617 24.7629Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M33.2087 65.0888C36.2951 65.0888 38.7971 62.5851 38.7971 59.4966C38.7971 56.4081 36.2951 53.9044 33.2087 53.9044C30.1224 53.9044 27.6204 56.4081 27.6204 59.4966C27.6204 62.5851 30.1224 65.0888 33.2087 65.0888Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M49.2032 55.9756C52.2896 55.9756 54.7916 53.4719 54.7916 50.3834C54.7916 47.2949 52.2896 44.7912 49.2032 44.7912C46.1169 44.7912 43.6149 47.2949 43.6149 50.3834C43.6149 53.4719 46.1169 55.9756 49.2032 55.9756Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M54.6679 34.7045C57.7543 34.7045 60.2563 32.2008 60.2563 29.1123C60.2563 26.0239 57.7543 23.5201 54.6679 23.5201C51.5816 23.5201 49.0796 26.0239 49.0796 29.1123C49.0796 32.2008 51.5816 34.7045 54.6679 34.7045Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M65.8447 64.5296C68.9311 64.5296 71.4331 62.0259 71.4331 58.9374C71.4331 55.8489 68.9311 53.3452 65.8447 53.3452C62.7583 53.3452 60.2563 55.8489 60.2563 58.9374C60.2563 62.0259 62.7583 64.5296 65.8447 64.5296Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M70.8121 59.5588C73.8985 59.5588 76.4005 57.0551 76.4005 53.9666C76.4005 50.8781 73.8985 48.3744 70.8121 48.3744C67.7257 48.3744 65.2238 50.8781 65.2238 53.9666C65.2238 57.0551 67.7257 59.5588 70.8121 59.5588Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M78.2633 59.5588C81.3497 59.5588 83.8516 57.0551 83.8516 53.9666C83.8516 50.8781 81.3497 48.3744 78.2633 48.3744C75.1769 48.3744 72.6749 50.8781 72.6749 53.9666C72.6749 57.0551 75.1769 59.5588 78.2633 59.5588Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M70.8121 24.7629C73.8985 24.7629 76.4005 22.2592 76.4005 19.1707C76.4005 16.0822 73.8985 13.5785 70.8121 13.5785C67.7257 13.5785 65.2238 16.0822 65.2238 19.1707C65.2238 22.2592 67.7257 24.7629 70.8121 24.7629Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M5.8878 48.9336C8.97416 48.9336 11.4762 46.4299 11.4762 43.3414C11.4762 40.2529 8.97416 37.7492 5.8878 37.7492C2.80143 37.7492 0.299438 40.2529 0.299438 43.3414C0.299438 46.4299 2.80143 48.9336 5.8878 48.9336Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M66.7389 78.7586C69.8252 78.7586 72.3272 76.2549 72.3272 73.1664C72.3272 70.0779 69.8252 67.5742 66.7389 67.5742C63.6525 67.5742 61.1505 70.0779 61.1505 73.1664C61.1505 76.2549 63.6525 78.7586 66.7389 78.7586Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M28.1008 36.0301C31.1872 36.0301 33.6892 33.5264 33.6892 30.4379C33.6892 27.3494 31.1872 24.8457 28.1008 24.8457C25.0144 24.8457 22.5125 27.3494 22.5125 30.4379C22.5125 33.5264 25.0144 36.0301 28.1008 36.0301Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M59.1991 30.4897C62.2854 30.4897 64.7874 27.986 64.7874 24.8975C64.7874 21.809 62.2854 19.3053 59.1991 19.3053C56.1127 19.3053 53.6107 21.809 53.6107 24.8975C53.6107 27.986 56.1127 30.4897 59.1991 30.4897Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M26.9994 30.2929C30.0857 30.2929 32.5877 27.7892 32.5877 24.7007C32.5877 21.6122 30.0857 19.1085 26.9994 19.1085C23.913 19.1085 21.411 21.6122 21.411 24.7007C21.411 27.7892 23.913 30.2929 26.9994 30.2929Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M90.6819 86.8984C93.7682 86.8984 96.2702 84.3947 96.2702 81.3062C96.2702 78.2177 93.7682 75.714 90.6819 75.714C87.5955 75.714 85.0935 78.2177 85.0935 81.3062C85.0935 84.3947 87.5955 86.8984 90.6819 86.8984Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M131.837 55.9176C134.923 55.9176 137.425 53.4139 137.425 50.3254C137.425 47.2369 134.923 44.7332 131.837 44.7332C128.751 44.7332 126.249 47.2369 126.249 50.3254C126.249 53.4139 128.751 55.9176 131.837 55.9176Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M147.981 45.976C151.068 45.976 153.57 43.4722 153.57 40.3838C153.57 37.2953 151.068 34.7916 147.981 34.7916C144.895 34.7916 142.393 37.2953 142.393 40.3838C142.393 43.4722 144.895 45.976 147.981 45.976Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M107.882 32.8777C110.968 32.8777 113.47 30.374 113.47 27.2856C113.47 24.1971 110.968 21.6934 107.882 21.6934C104.795 21.6934 102.293 24.1971 102.293 27.2856C102.293 30.374 104.795 32.8777 107.882 32.8777Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M131.315 61.3607C134.402 61.3607 136.904 58.8569 136.904 55.7685C136.904 52.68 134.402 50.1763 131.315 50.1763C128.229 50.1763 125.727 52.68 125.727 55.7685C125.727 58.8569 128.229 61.3607 131.315 61.3607Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M104.156 51.5184C107.242 51.5184 109.744 49.0147 109.744 45.9262C109.744 42.8378 107.242 40.334 104.156 40.334C101.07 40.334 98.5676 42.8378 98.5676 45.9262C98.5676 49.0147 101.07 51.5184 104.156 51.5184Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M88.7569 71.3397C91.8433 71.3397 94.3453 68.836 94.3453 65.7475C94.3453 62.659 91.8433 60.1553 88.7569 60.1553C85.6706 60.1553 83.1686 62.659 83.1686 65.7475C83.1686 68.836 85.6706 71.3397 88.7569 71.3397Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M93.7243 76.3105C96.8107 76.3105 99.3127 73.8068 99.3127 70.7183C99.3127 67.6298 96.8107 65.1261 93.7243 65.1261C90.638 65.1261 88.136 67.6298 88.136 70.7183C88.136 73.8068 90.638 76.3105 93.7243 76.3105Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M121.393 70.7804C124.479 70.7804 126.981 68.2767 126.981 65.1882C126.981 62.0997 124.479 59.596 121.393 59.596C118.307 59.596 115.805 62.0997 115.805 65.1882C115.805 68.2767 118.307 70.7804 121.393 70.7804Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M126.36 65.8096C129.447 65.8096 131.949 63.3059 131.949 60.2174C131.949 57.1289 129.447 54.6252 126.36 54.6252C123.274 54.6252 120.772 57.1289 120.772 60.2174C120.772 63.3059 123.274 65.8096 126.36 65.8096Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M133.812 65.8096C136.898 65.8096 139.4 63.3059 139.4 60.2174C139.4 57.1289 136.898 54.6252 133.812 54.6252C130.725 54.6252 128.223 57.1289 128.223 60.2174C128.223 63.3059 130.725 65.8096 133.812 65.8096Z"
            fill="#7B61FF"
          />
          <path
            opacity="0.59"
            d="M122.287 85.0095C125.373 85.0095 127.875 82.5058 127.875 79.4173C127.875 76.3288 125.373 73.8251 122.287 73.8251C119.201 73.8251 116.699 76.3288 116.699 79.4173C116.699 82.5058 119.201 85.0095 122.287 85.0095Z"
            fill="#7B61FF"
          />
        </g>
        <defs>
          <clipPath id="clip0_15_1623">
            <rect
              width="153.27"
              height="86.4305"
              fill="white"
              transform="translate(0.299438 0.467896)"
            />
          </clipPath>
        </defs>
      </svg>
    );
  }
  return (
    <svg
      style={style}
      width="155"
      height="88"
      viewBox="0 0 155 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_13_593)">
        <path
          d="M88.8457 59.8269C91.9392 59.8269 94.447 57.3173 94.447 54.2217C94.447 51.126 91.9392 48.6165 88.8457 48.6165C85.7522 48.6165 83.2444 51.126 83.2444 54.2217C83.2444 57.3173 85.7522 59.8269 88.8457 59.8269Z"
          fill="#99F5FF"
        />
        <path
          d="M97.559 53.5989C100.652 53.5989 103.16 51.0894 103.16 47.9937C103.16 44.8981 100.652 42.3885 97.559 42.3885C94.4654 42.3885 91.9576 44.8981 91.9576 47.9937C91.9576 51.0894 94.4654 53.5989 97.559 53.5989Z"
          fill="#99F5FF"
        />
        <path
          d="M97.559 66.0548C100.652 66.0548 103.16 63.5453 103.16 60.4497C103.16 57.354 100.652 54.8445 97.559 54.8445C94.4654 54.8445 91.9576 57.354 91.9576 60.4497C91.9576 63.5453 94.4654 66.0548 97.559 66.0548Z"
          fill="#99F5FF"
        />
        <path
          d="M102.538 66.0548C105.631 66.0548 108.139 63.5453 108.139 60.4497C108.139 57.354 105.631 54.8445 102.538 54.8445C99.4443 54.8445 96.9365 57.354 96.9365 60.4497C96.9365 63.5453 99.4443 66.0548 102.538 66.0548Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.9"
          d="M120.86 50.4226C123.954 50.4226 126.462 47.9131 126.462 44.8175C126.462 41.7218 123.954 39.2123 120.86 39.2123C117.767 39.2123 115.259 41.7218 115.259 44.8175C115.259 47.9131 117.767 50.4226 120.86 50.4226Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.9"
          d="M95.0695 44.8797C98.163 44.8797 100.671 42.3702 100.671 39.2746C100.671 36.1789 98.163 33.6694 95.0695 33.6694C91.9759 33.6694 89.4681 36.1789 89.4681 39.2746C89.4681 42.3702 91.9759 44.8797 95.0695 44.8797Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.75"
          d="M91.3352 36.1606C94.4287 36.1606 96.9365 33.6511 96.9365 30.5554C96.9365 27.4598 94.4287 24.9503 91.3352 24.9503C88.2417 24.9503 85.7339 27.4598 85.7339 30.5554C85.7339 33.6511 88.2417 36.1606 91.3352 36.1606Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.75"
          d="M95.0695 29.9326C98.163 29.9326 100.671 27.4231 100.671 24.3275C100.671 21.2318 98.163 18.7223 95.0695 18.7223C91.9759 18.7223 89.4681 21.2318 89.4681 24.3275C89.4681 27.4231 91.9759 29.9326 95.0695 29.9326Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M101.293 24.9503C104.387 24.9503 106.894 22.4407 106.894 19.3451C106.894 16.2494 104.387 13.7399 101.293 13.7399C98.1996 13.7399 95.6918 16.2494 95.6918 19.3451C95.6918 22.4407 98.1996 24.9503 101.293 24.9503Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M33.7288 65.3697C36.8223 65.3697 39.3301 62.8602 39.3301 59.7646C39.3301 56.6689 36.8223 54.1594 33.7288 54.1594C30.6352 54.1594 28.1274 56.6689 28.1274 59.7646C28.1274 62.8602 30.6352 65.3697 33.7288 65.3697Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M49.7604 56.2354C52.8539 56.2354 55.3617 53.7259 55.3617 50.6302C55.3617 47.5346 52.8539 45.0251 49.7604 45.0251C46.6669 45.0251 44.1591 47.5346 44.1591 50.6302C44.1591 53.7259 46.6669 56.2354 49.7604 56.2354Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M55.2378 34.915C58.3313 34.915 60.8391 32.4055 60.8391 29.3098C60.8391 26.2142 58.3313 23.7047 55.2378 23.7047C52.1443 23.7047 49.6365 26.2142 49.6365 29.3098C49.6365 32.4055 52.1443 34.915 55.2378 34.915Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M66.4404 64.8092C69.534 64.8092 72.0418 62.2997 72.0418 59.2041C72.0418 56.1084 69.534 53.5989 66.4404 53.5989C63.3469 53.5989 60.8391 56.1084 60.8391 59.2041C60.8391 62.2997 63.3469 64.8092 66.4404 64.8092Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M71.4194 59.8269C74.513 59.8269 77.0208 57.3173 77.0208 54.2217C77.0208 51.126 74.513 48.6165 71.4194 48.6165C68.3259 48.6165 65.8181 51.126 65.8181 54.2217C65.8181 57.3173 68.3259 59.8269 71.4194 59.8269Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M78.8878 59.8269C81.9813 59.8269 84.4891 57.3173 84.4891 54.2217C84.4891 51.126 81.9813 48.6165 78.8878 48.6165C75.7943 48.6165 73.2865 51.126 73.2865 54.2217C73.2865 57.3173 75.7943 59.8269 78.8878 59.8269Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M71.4194 24.9503C74.513 24.9503 77.0208 22.4407 77.0208 19.3451C77.0208 16.2494 74.513 13.7399 71.4194 13.7399C68.3259 13.7399 65.8181 16.2494 65.8181 19.3451C65.8181 22.4407 68.3259 24.9503 71.4194 24.9503Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M6.34449 49.177C9.43801 49.177 11.9458 46.6675 11.9458 43.5719C11.9458 40.4762 9.43801 37.9667 6.34449 37.9667C3.25096 37.9667 0.743164 40.4762 0.743164 43.5719C0.743164 46.6675 3.25096 49.177 6.34449 49.177Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M67.3367 79.0713C70.4302 79.0713 72.938 76.5618 72.938 73.4661C72.938 70.3705 70.4302 67.8609 67.3367 67.8609C64.2431 67.8609 61.7354 70.3705 61.7354 73.4661C61.7354 76.5618 64.2431 79.0713 67.3367 79.0713Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M28.609 36.2436C31.7025 36.2436 34.2103 33.7341 34.2103 30.6385C34.2103 27.5428 31.7025 25.0333 28.609 25.0333C25.5155 25.0333 23.0077 27.5428 23.0077 30.6385C23.0077 33.7341 25.5155 36.2436 28.609 36.2436Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M59.7795 30.6904C62.8731 30.6904 65.3809 28.1808 65.3809 25.0852C65.3809 21.9895 62.8731 19.48 59.7795 19.48C56.686 19.48 54.1782 21.9895 54.1782 25.0852C54.1782 28.1808 56.686 30.6904 59.7795 30.6904Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M27.505 30.4931C30.5985 30.4931 33.1063 27.9836 33.1063 24.888C33.1063 21.7923 30.5985 19.2828 27.505 19.2828C24.4115 19.2828 21.9037 21.7923 21.9037 24.888C21.9037 27.9836 24.4115 30.4931 27.505 30.4931Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M91.3352 87.2299C94.4287 87.2299 96.9365 84.7204 96.9365 81.6247C96.9365 78.5291 94.4287 76.0196 91.3352 76.0196C88.2417 76.0196 85.7339 78.5291 85.7339 81.6247C85.7339 84.7204 88.2417 87.2299 91.3352 87.2299Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M132.586 56.1773C135.679 56.1773 138.187 53.6678 138.187 50.5721C138.187 47.4765 135.679 44.9669 132.586 44.9669C129.492 44.9669 126.985 47.4765 126.985 50.5721C126.985 53.6678 129.492 56.1773 132.586 56.1773Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M148.767 46.2125C151.861 46.2125 154.369 43.703 154.369 40.6074C154.369 37.5117 151.861 35.0022 148.767 35.0022C145.674 35.0022 143.166 37.5117 143.166 40.6074C143.166 43.703 145.674 46.2125 148.767 46.2125Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M108.575 33.084C111.668 33.084 114.176 30.5745 114.176 27.4788C114.176 24.3832 111.668 21.8736 108.575 21.8736C105.481 21.8736 102.974 24.3832 102.974 27.4788C102.974 30.5745 105.481 33.084 108.575 33.084Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M132.063 61.633C135.157 61.633 137.664 59.1235 137.664 56.0278C137.664 52.9322 135.157 50.4226 132.063 50.4226C128.97 50.4226 126.462 52.9322 126.462 56.0278C126.462 59.1235 128.97 61.633 132.063 61.633Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M104.841 51.7679C107.934 51.7679 110.442 49.2584 110.442 46.1627C110.442 43.0671 107.934 40.5575 104.841 40.5575C101.747 40.5575 99.2394 43.0671 99.2394 46.1627C99.2394 49.2584 101.747 51.7679 104.841 51.7679Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M89.4059 71.6351C92.4994 71.6351 95.0072 69.1256 95.0072 66.0299C95.0072 62.9343 92.4994 60.4247 89.4059 60.4247C86.3124 60.4247 83.8046 62.9343 83.8046 66.0299C83.8046 69.1256 86.3124 71.6351 89.4059 71.6351Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M94.3849 76.6174C97.4784 76.6174 99.9862 74.1079 99.9862 71.0123C99.9862 67.9166 97.4784 65.4071 94.3849 65.4071C91.2914 65.4071 88.7836 67.9166 88.7836 71.0123C88.7836 74.1079 91.2914 76.6174 94.3849 76.6174Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M122.118 71.0746C125.211 71.0746 127.719 68.565 127.719 65.4694C127.719 62.3737 125.211 59.8642 122.118 59.8642C119.024 59.8642 116.516 62.3737 116.516 65.4694C116.516 68.565 119.024 71.0746 122.118 71.0746Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M127.097 66.0922C130.19 66.0922 132.698 63.5827 132.698 60.487C132.698 57.3914 130.19 54.8819 127.097 54.8819C124.003 54.8819 121.495 57.3914 121.495 60.487C121.495 63.5827 124.003 66.0922 127.097 66.0922Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M134.565 66.0922C137.658 66.0922 140.166 63.5827 140.166 60.487C140.166 57.3914 137.658 54.8819 134.565 54.8819C131.471 54.8819 128.964 57.3914 128.964 60.487C128.964 63.5827 131.471 66.0922 134.565 66.0922Z"
          fill="#99F5FF"
        />
        <path
          opacity="0.59"
          d="M123.014 85.3366C126.107 85.3366 128.615 82.8271 128.615 79.7314C128.615 76.6358 126.107 74.1263 123.014 74.1263C119.92 74.1263 117.412 76.6358 117.412 79.7314C117.412 82.8271 119.92 85.3366 123.014 85.3366Z"
          fill="#99F5FF"
        />
      </g>
      <defs>
        <clipPath id="clip0_13_593">
          <rect
            width="153.626"
            height="86.631"
            fill="white"
            transform="translate(0.743164 0.598907)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

const Scatter = ({ theme }: SvgProps) => {
  return (
    <Fragment>
      {/* <ScatterTitle
        theme={theme}
        style={{
          position: "absolute",
          top: 21,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      /> */}
      <ScatterBubbles
        theme={theme}
        style={{
          position: "absolute",
          bottom: 5,
          left: "50%",
          transform: "translateX(-50%)",
          height: 105,
        }}
      />
    </Fragment>
  );
};

export default Scatter;
