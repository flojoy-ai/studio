export const DetailsButtonSVG = ({ theme }) => {
  return (
    <div
      style={{
        top: "10px",
        position: "absolute",
        right: "24px",
        cursor: "pointer",
      }}
    >
      {theme === "light" ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 10 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.87152 1.61222C7.06873 1.41719 7.33619 1.30762 7.61508 1.30762C7.89397 1.30762 8.16143 1.41719 8.35863 1.61222C8.55584 1.80726 8.66663 2.07179 8.66663 2.34761C8.66663 2.62343 8.55584 2.88796 8.35863 3.08299L3.64944 7.74044L1.66663 8.23069L2.16233 6.26967L6.87152 1.61222Z"
            stroke="#6445CE"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 10 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.87164 1.61222C7.06885 1.41719 7.33631 1.30762 7.6152 1.30762C7.89409 1.30762 8.16155 1.41719 8.35876 1.61222C8.55596 1.80726 8.66675 2.07179 8.66675 2.34761C8.66675 2.62343 8.55596 2.88796 8.35876 3.08299L3.64957 7.74044L1.66675 8.23069L2.16245 6.26967L6.87164 1.61222Z"
            stroke="#94F4FC"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      )}
    </div>
  );
};
