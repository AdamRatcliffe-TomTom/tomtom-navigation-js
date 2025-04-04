import React from "react";

const StraightIcon = ({ size = 56, color = "white" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 88 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.3091 33.2128C21.2739 34.8841 23.0237 36.886 24.8268 36.0932L33.8602 32.1213C34.8551 31.6839 36 32.4163 36 33.5V85C36 86.6569 37.3431 88 39 88H49C50.6569 88 52 86.6569 52 85V33.5C52 32.4163 53.1449 31.6839 54.1398 32.1213L63.1732 36.0932C64.9763 36.886 66.7261 34.8841 65.6909 33.2128L45.7077 0.949459C44.9235 -0.316489 43.0765 -0.316485 42.2923 0.949464L22.3091 33.2128Z"
      fill={color}
    />
  </svg>
);

export default StraightIcon;
