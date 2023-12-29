import React from "react";

const SkipForwardIcon = ({ size = 24, color = "#263543" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 4 15 12 5 20 5 4" stroke={color}></polygon>
    <line x1="19" y1="5" x2="19" y2="19" stroke={color}></line>
  </svg>
);

export default SkipForwardIcon;
