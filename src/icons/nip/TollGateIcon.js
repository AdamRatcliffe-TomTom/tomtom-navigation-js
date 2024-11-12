import React from "react";

const TollGateIcon = ({ size = 56, color = "white" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 88 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_7764_2411)">
      <ellipse
        cx="28"
        cy="54"
        rx="18.5"
        ry="6.5"
        stroke={color}
        strokeWidth="5"
      />
      <path
        d="M46.5 54C46.5 54 46.5 60.4101 46.5 64C46.5 67.5899 38.2173 70.5 28 70.5C17.7827 70.5 9.5 67.5899 9.5 64C9.5 61.4868 9.5 54 9.5 54"
        stroke={color}
        strokeWidth="5"
      />
      <path
        d="M46.5 63C46.5 63 46.5 69.4101 46.5 73C46.5 76.5899 38.2173 79.5 28 79.5C17.7827 79.5 9.5 76.5899 9.5 73C9.5 70.4868 9.5 63 9.5 63"
        stroke={color}
        strokeWidth="5"
      />
      <path
        d="M56.5 56.5H70.5C74.9183 56.5 78.5 52.9183 78.5 48.5V18.5C78.5 14.0817 74.9183 10.5 70.5 10.5H19.5C15.0817 10.5 11.5 14.0817 11.5 18.5V41"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M49.6866 42.8283C52.5827 40.959 54.5 37.7034 54.5 34C54.5 28.201 49.799 23.5 44 23.5C38.201 23.5 33.5 28.201 33.5 34C33.5 35.6104 33.8625 37.1361 34.5104 38.5"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="23.5" cy="22.5" r="3.5" fill={color} />
      <circle cx="66.5" cy="44.5" r="3.5" fill={color} />
    </g>
    <defs>
      <clipPath id="clip0_7764_2411">
        <rect width="88" height="88" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default TollGateIcon;
