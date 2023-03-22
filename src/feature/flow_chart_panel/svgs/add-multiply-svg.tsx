import { CSSProperties } from "react";

interface SVGProps {
  style?: CSSProperties;
}

export const AddBGTemplate = ({ style }: SVGProps) => {
  return (
    <svg
      data-testid="default-svg"
      style={style}
      width="99"
      height="100"
      viewBox="0 0 72 81"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M69.7184 43.874L6.41934 79.9997C4.08605 81.3313 1.18449 79.6464 1.18449 76.9599V4.70849C1.18449 2.02195 4.08604 0.337065 6.41933 1.66871L69.7184 37.7944C72.072 39.1376 72.072 42.5308 69.7184 43.874Z"
        fill="#FFC93F"
        fillOpacity="0.2"
        stroke="#FFC93F"
      />
    </svg>
  );
};

export const MultiplySvg = ({ style }: SVGProps) => {
  return (
    <svg
      data-testid="multiply-svg"
      style={style}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_13_586)">
        <path
          d="M1.12264 2.46631L9.61248 11.7301L10.8253 13.0468C11.9573 14.2828 13.7939 12.4462 12.6619 11.2103L4.1605 1.94652L2.95922 0.618183C1.82724 -0.617753 -0.0093348 1.23038 1.12264 2.46631Z"
          fill="#FFC93F"
        />
        <path
          d="M10.8254 0.618143L2.324 9.89344L1.11117 11.2102C-0.0208093 12.4462 1.81577 14.2827 2.94775 13.0468L11.4491 3.78306L12.662 2.46627C13.7939 1.23034 11.9574 -0.606241 10.8254 0.629694V0.618143Z"
          fill="#FFC93F"
        />
      </g>
      <defs>
        <clipPath id="clip0_13_586">
          <rect
            width="12.2438"
            height="13.2372"
            fill="white"
            transform="translate(0.764648 0.213867)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export const AddSvg = ({ style }: SVGProps) => {
  return (
    <svg
      data-testid="add-svg"
      style={style}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.24222 6.58536H15.1016V9.19278H9.24222V15.1107H6.6348V9.19278H0.79007V6.58536H6.6348V0.608795H9.24222V6.58536Z"
        fill="#FFC93F"
      />
    </svg>
  );
};

export const AtSvg = ({ style }: SVGProps) => {
  return (
    <svg
      data-testid="matmul-svg"
      style={style}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M1.12264 2.46631L9.61248 11.7301L10.8253 13.0468C11.9573 14.2828 13.7939 12.4462 12.6619 11.2103L4.1605 1.94652L2.95922 0.618183C1.82724 -0.617753 -0.0093348 1.23038 1.12264 2.46631Z"
          fill="#FFC93F"
        />
        <path
          d="M10.8254 0.618143L2.324 9.89344L1.11117 11.2102C-0.0208093 12.4462 1.81577 14.2827 2.94775 13.0468L11.4491 3.78306L12.662 2.46627C13.7939 1.23034 11.9574 -0.606241 10.8254 0.629694V0.618143Z"
          fill="#FFC93F"
        />
        <circle
          cx="7"
          cy="7"
          r="7"
          stroke="#FFC93F"
          strokeWidth="2"
          fill="none"
        ></circle>
      </g>
    </svg>
  );
};

export const SubSvg = ({ style }: SVGProps) => {
  return (
    <svg
      data-testid="sub-svg"
      style={style}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.24222 6.58536H15.1016V9.19278H6.6348V9.19278H0.79007V6.58536"
        fill="#FFC93F"
      />
    </svg>
  );
};
