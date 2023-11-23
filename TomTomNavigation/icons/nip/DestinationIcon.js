import React from "react";

const DestinationIcon = ({ size = 56, color = "white" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 88 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 20C16.8954 20 16 20.8954 16 22V66C16 67.1046 16.8954 68 18 68C19.1046 68 20 67.1046 20 66V22C20 20.8954 19.1046 20 18 20Z"
      fill={color}
    />
    <path
      d="M68 22C68 20.8954 68.8954 20 70 20C71.1046 20 72 20.8954 72 22V66C72 67.1046 71.1046 68 70 68C68.8954 68 68 67.1046 68 66V22Z"
      fill={color}
    />
    <path d="M29.7143 24H24V29.7778H29.7143V24Z" fill={color} />
    <path
      d="M52.5711 24H46.8568V29.7777H41.143V35.5555H46.8572L46.8568 29.7777L52.5711 29.7778V24Z"
      fill={color}
    />
    <path
      d="M35.4284 24H41.1427L41.143 29.7777L35.4286 29.7778V35.5555H29.7143L29.7143 29.7778H35.4286L35.4284 24Z"
      fill={color}
    />
    <path d="M64 24H58.2857V29.7778H64V24Z" fill={color} />
    <path
      d="M24 35.5555L29.7143 35.5555L29.7143 41.3333H24V35.5555Z"
      fill={color}
    />
    <path
      d="M52.5711 35.5556L46.8572 35.5555L46.8568 41.3333H52.5711V35.5556Z"
      fill={color}
    />
    <path
      d="M35.4286 35.5555H41.143L41.1427 41.3333H35.4284L35.4286 35.5555Z"
      fill={color}
    />
    <path d="M64 35.5556H58.2857V41.3333H64V35.5556Z" fill={color} />
    <path d="M52.5711 29.7778H58.2857V35.5556H52.5711V29.7778Z" fill={color} />
  </svg>
);

export default DestinationIcon;
