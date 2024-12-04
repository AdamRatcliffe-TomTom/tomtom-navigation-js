import React from "react";

const EastIcon = ({ size = 56, color = "white" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 88 88"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M57.7704 30.1209L45.1235 9.64429C44.5709 8.77959 43.3262 8.7867 42.7836 9.65751L30.2214 30.1544C29.5442 31.2396 30.5236 32.6083 31.7454 32.2852H56.3372C57.5282 32.5277 58.4458 31.1798 57.7704 30.1209ZM34.6664 79.0001H53.3331V74.5932H39.6813V63.505H52.4973V59.1929H39.6813V49.5262H53.3331V45.1667H34.6664V79.0001Z"
      fill={color}
    />
  </svg>
);

export default EastIcon;
