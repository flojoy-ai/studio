import { memo } from "react";

export const BoxPlot = () => {
  return (
    <svg
      width="125"
      height="126"
      viewBox="0 0 125 126"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.5 6C0.5 2.96244 2.96243 0.5 6 0.5H119C122.038 0.5 124.5 2.96243 124.5 6V119.796C124.5 122.834 122.038 125.296 119 125.296H6C2.96243 125.296 0.5 122.834 0.5 119.796V6Z"
        className="fill-accent1 stroke-accent1"
        fillOpacity="0.05"
      />
      <g clipPath="url(#clip0_5_208)">
        <path
          d="M69.3082 68.2507H60.5776C59.7717 68.2507 59.1225 68.9699 59.1225 69.8627V77.6129C59.1225 78.5058 59.7717 79.225 60.5776 79.225H63.124V94.8246C63.124 95.9407 63.9355 96.8397 64.9429 96.8397C65.9503 96.8397 66.7618 95.9407 66.7618 94.8246V79.225H69.3082C70.1141 79.225 70.7633 78.5058 70.7633 77.6129V69.8627C70.7633 68.9699 70.1141 68.2507 69.3082 68.2507Z"
          className="fill-accent1"
        />
        <path
          opacity="0.5"
          d="M75.1286 89.6661H83.8593C84.6652 89.6661 85.3144 88.9469 85.3144 88.054V77.9229C85.3144 77.0301 84.6652 76.3109 83.8593 76.3109H81.3128V67.0974C81.3128 65.9876 80.5013 65.0824 79.4939 65.0824C78.4866 65.0824 77.6751 65.9814 77.6751 67.0974V76.3109H75.1286C74.3227 76.3109 73.6735 77.0301 73.6735 77.9229V88.054C73.6735 88.9469 74.3227 89.6661 75.1286 89.6661ZM44.5714 82.8335H47.1178V88.3826C47.1178 89.4987 47.9293 90.3977 48.9367 90.3977C49.9441 90.3977 50.7556 89.4987 50.7556 88.3826V82.8335H53.302C54.1079 82.8335 54.7571 82.1143 54.7571 81.2214V71.9336C54.7571 71.0407 54.1079 70.3215 53.302 70.3215H50.7556V62.2613C50.7556 61.1515 49.9441 60.2462 48.9367 60.2462C47.9293 60.2462 47.1178 61.1453 47.1178 62.2613V70.3215H44.5714C43.7655 70.3215 43.1163 71.0407 43.1163 71.9336V81.2214C43.1163 82.1143 43.7655 82.8335 44.5714 82.8335Z"
          className="fill-accent1"
        />
        <path
          d="M86.8143 67.5872H89.3607V73.1364C89.3607 74.2524 90.1722 75.1515 91.1796 75.1515C92.187 75.1515 92.9985 74.2524 92.9985 73.1364V67.5872H95.5449C96.3508 67.5872 97 66.868 97 65.9752V56.6873C97 55.7945 96.3508 55.0753 95.5449 55.0753H92.9985V47.0151C92.9985 45.9052 92.187 45 91.1796 45C90.1722 45 89.3607 45.899 89.3607 47.0151V55.0753H86.8143C86.0084 55.0753 85.3592 55.7945 85.3592 56.6873V65.9752C85.3592 66.868 86.0084 67.5872 86.8143 67.5872Z"
          className="fill-accent1"
        />
        <path
          d="M38.1857 79.4048H29.4551C28.6492 79.4048 28 80.124 28 81.0168V88.767C28 89.6599 28.6492 90.3791 29.4551 90.3791H32.0015V105.979C32.0015 107.095 32.813 107.994 33.8204 107.994C34.8278 107.994 35.6393 107.095 35.6393 105.979V90.3791H38.1857C38.9916 90.3791 39.6408 89.6599 39.6408 88.767V81.0168C39.6408 80.124 38.9916 79.4048 38.1857 79.4048Z"
          className="fill-accent1"
        />
      </g>
      <path
        d="M25.3879 24.0371H28.4983C29.9156 24.0371 30.9433 24.2399 31.5813 24.6455C32.2239 25.0465 32.5452 25.6868 32.5452 26.5664C32.5452 27.1634 32.4039 27.6533 32.1213 28.0361C31.8433 28.4189 31.4719 28.6491 31.0071 28.7265V28.7949C31.6405 28.9362 32.0963 29.2005 32.3743 29.5879C32.6568 29.9752 32.7981 30.4902 32.7981 31.1328C32.7981 32.0443 32.4677 32.7552 31.8069 33.2656C31.1506 33.776 30.2574 34.0312 29.1272 34.0312H25.3879V24.0371ZM27.5071 27.9951H28.7375C29.3118 27.9951 29.7265 27.9062 29.9817 27.7285C30.2415 27.5508 30.3713 27.2568 30.3713 26.8467C30.3713 26.4639 30.2301 26.1904 29.9475 26.0264C29.6695 25.8577 29.2275 25.7734 28.6213 25.7734H27.5071V27.9951ZM27.5071 29.6767V32.2812H28.8879C29.4713 32.2812 29.9019 32.1696 30.1799 31.9463C30.4579 31.723 30.5969 31.3812 30.5969 30.9209C30.5969 30.0915 30.0045 29.6767 28.8196 29.6767H27.5071ZM44.8455 29.0205C44.8455 30.6748 44.4353 31.9463 43.615 32.8349C42.7947 33.7236 41.6189 34.168 40.0877 34.168C38.5564 34.168 37.3806 33.7236 36.5603 32.8349C35.74 31.9463 35.3299 30.6702 35.3299 29.0068C35.3299 27.3434 35.74 26.0742 36.5603 25.1992C37.3852 24.3196 38.5655 23.8799 40.1013 23.8799C41.6371 23.8799 42.8106 24.3219 43.6218 25.206C44.4376 26.0902 44.8455 27.3616 44.8455 29.0205ZM37.5515 29.0205C37.5515 30.137 37.7634 30.9778 38.1873 31.543C38.6111 32.1081 39.2446 32.3906 40.0877 32.3906C41.7784 32.3906 42.6238 31.2672 42.6238 29.0205C42.6238 26.7692 41.783 25.6435 40.1013 25.6435C39.2582 25.6435 38.6225 25.9284 38.1941 26.498C37.7657 27.0631 37.5515 27.904 37.5515 29.0205ZM55.9768 34.0312H53.5569L51.2327 30.251L48.9085 34.0312H46.639L49.9544 28.8769L46.8509 24.0371H49.1888L51.3421 27.6328L53.4544 24.0371H55.7376L52.5999 28.9931L55.9768 34.0312ZM64.9505 28.7402H65.6478C66.2995 28.7402 66.7871 28.6126 67.1107 28.3574C67.4342 28.0976 67.596 27.7217 67.596 27.2295C67.596 26.7327 67.4593 26.3659 67.1859 26.1289C66.917 25.8919 66.4932 25.7734 65.9144 25.7734H64.9505V28.7402ZM69.7357 27.1543C69.7357 28.2298 69.3984 29.0524 68.724 29.6221C68.054 30.1917 67.0993 30.4765 65.8597 30.4765H64.9505V34.0312H62.8314V24.0371H66.0238C67.236 24.0371 68.1566 24.2991 68.7855 24.8232C69.4189 25.3428 69.7357 26.1198 69.7357 27.1543ZM72.6024 34.0312V24.0371H74.7215V32.2812H78.7752V34.0312H72.6024ZM90.5697 29.0205C90.5697 30.6748 90.1595 31.9463 89.3392 32.8349C88.5189 33.7236 87.3431 34.168 85.8119 34.168C84.2806 34.168 83.1049 33.7236 82.2845 32.8349C81.4642 31.9463 81.0541 30.6702 81.0541 29.0068C81.0541 27.3434 81.4642 26.0742 82.2845 25.1992C83.1094 24.3196 84.2898 23.8799 85.8256 23.8799C87.3614 23.8799 88.5349 24.3219 89.3461 25.206C90.1618 26.0902 90.5697 27.3616 90.5697 29.0205ZM83.2758 29.0205C83.2758 30.137 83.4877 30.9778 83.9115 31.543C84.3353 32.1081 84.9688 32.3906 85.8119 32.3906C87.5026 32.3906 88.348 31.2672 88.348 29.0205C88.348 26.7692 87.5072 25.6435 85.8256 25.6435C84.9825 25.6435 84.3467 25.9284 83.9183 26.498C83.4899 27.0631 83.2758 27.904 83.2758 29.0205ZM97.4765 34.0312H95.3573V25.8008H92.6434V24.0371H100.19V25.8008H97.4765V34.0312Z"
        className="fill-accent1"
      />
      <defs>
        <clipPath id="clip0_5_208">
          <rect
            width="69"
            height="63"
            fill="white"
            transform="translate(28 45)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default memo(BoxPlot);
