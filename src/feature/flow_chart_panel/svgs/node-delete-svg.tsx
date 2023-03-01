export const NodeDeleteSVG = ({ theme }) => {
  return (
    <div
      style={{
        cursor: "pointer",
      }}
    >
      {theme === "light" ? (
        <svg
          width="15"
          height="15"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.758667 7.2406L7.24133 0.759766M0.758667 0.759766L7.24133 7.2406"
            stroke="#6445CE"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      ) : (
        <svg
          width="15"
          height="15"
          viewBox="0 0 8 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.758545 7.2406L7.24121 0.759766M0.758545 0.759766L7.24121 7.2406"
            stroke="#94F4FC"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      )}
    </div>
  );
};
