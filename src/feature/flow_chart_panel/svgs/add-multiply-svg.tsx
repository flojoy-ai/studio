import { SVGProps } from "react";

export const AddBGTemplate = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      data-testid="default-svg"
      width="99"
      height="100"
      viewBox="0 0 72 81"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
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

export const MultiplySvg = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      data-testid="multiply-svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
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

export const AddSvg = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      data-testid="add-svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.24222 6.58536H15.1016V9.19278H9.24222V15.1107H6.6348V9.19278H0.79007V6.58536H6.6348V0.608795H9.24222V6.58536Z"
        fill="#FFC93F"
      />
    </svg>
  );
};

export const AtSvg = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      data-testid="matmul-svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
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

export const SubSvg = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      data-testid="sub-svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.24222 6.58536H15.1016V9.19278H6.6348V9.19278H0.79007V6.58536"
        fill="#FFC93F"
      />
    </svg>
  );
};

export const ScipySvg = ({ ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 100 100' {...props}
    >
      <defs>
        <radialGradient id='g' cx='50%' cy='70%' r='70%'>
          <stop offset='0' stopColor='#0053A0'/>
          <stop offset='.5' stopColor='#0053A0'/>
          <stop offset='.95' stopColor='#00264a'/>
          <stop offset='1' stopColor='black'/>
        </radialGradient>
      </defs>
      <path d='M94,33l3-2 M97,28v3h2.5' fill='none' stroke='#000'/>
      <circle cx='50' cy='50' fill='url(#g)' r='47.5' stroke='#000'/>
      <path d='M7,77c24-27,23-4,44,2c18,4,23-15,10-25c-7-6-16-5-23-9c-10-5-8-20,2-23c29-10,16,32,49,13' fill='none' stroke='#fff' strokeWidth='7'/>
      <path d='M80,32l5,11l9-8l-1-3z' fill='#fff' stroke='#fff' strokeLinejoin='round' strokeWidth='1.5'/>
    </svg>
  );
};

export const NumpySvg = ({ ... props} : SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 200 300' {...props}
    >
      <g
        id="g243"
        transform="translate(-84,-51.24)"
        >
        <polygon
          fill = "#4dabcf"
          points="132.38,96.4 95.25,77.66 54.49,98 92.63,117.15 "
          id="polygon39" />
        <polygon
          fill = "#4dabcf"
          points="149.41,104.99 188.34,124.65 147.95,144.93 109.75,125.75 "
          id="polygon41" />
        <polygon
          fill = "#4dabcf"
          points="201.41,77.94 241.41,98 205.63,115.96 166.62,96.28 "
          id="polygon43" />
        <polygon
          fill = "#4dabcf"
          points="184.19,69.3 148.18,51.24 112.56,69.02 149.67,87.73 "
          id="polygon45" />
        <polygon
          fill = "#4dabcf"
          points="156.04,224.36 156.04,273.5 199.66,251.73 199.62,202.57 "
          id="polygon47" />
        <polygon
          fill = "#4dabcf"
          points="199.6,185.41 199.55,136.77 156.04,158.4 156.04,207.06 "
          id="polygon49" />
        <polygon
          fill = "#4dabcf"
          points="251.97,176.3 251.97,225.63 214.76,244.19 214.73,195.09 "
          id="polygon51" />
        <polygon
          fill = "#4dabcf"
          points="251.97,159.05 251.97,110.71 214.69,129.24 214.72,177.98 "
          id="polygon53" />
        <path
          fill="#4d77cf"
          d="m 140.64,158.4 -29.38,-14.78 v 63.84 c 0,0 -35.94,-76.46 -39.26,-83.33 -0.43,-0.89 -2.19,-1.86 -2.64,-2.1 C 62.88,118.65 44,109.09 44,109.09 v 112.83 l 26.12,14 v -59 c 0,0 35.55,68.32 35.92,69.07 0.37,0.75 3.92,7.94 7.74,10.47 5.07,3.37 26.84,16.46 26.84,16.46 z"
          id="path55" />
      </g>
    </svg>
  );
};