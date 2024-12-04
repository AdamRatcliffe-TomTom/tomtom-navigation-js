import React from "react";
import NorthIcon from "../icons/nip/NorthIcon";
import NorthEastIcon from "../icons/nip/NorthEastIcon";
import EastIcon from "../icons/nip/EastIcon";
import SouthEastIcon from "../icons/nip/SouthEastIcon";
import SouthIcon from "../icons/nip/SouthIcon";
import SouthWestIcon from "../icons/nip/SouthWestIcon";
import WestIcon from "../icons/nip/WestIcon";
import NorthWestIcon from "../icons/nip/NorthWestIcon";
import ArrowIcon from "../icons/nip/ArrowIcon";

export default function bearingToDirectionIcon(
  bearing,
  { size = 48, color = "white" } = {}
) {
  const directions = [
    NorthIcon,
    NorthEastIcon,
    EastIcon,
    SouthEastIcon,
    SouthIcon,
    SouthWestIcon,
    WestIcon,
    NorthWestIcon
  ];

  // Normalize the bearing to be between 0 and 360
  const normalizedBearing = (bearing + 360) % 360;

  // Determine which of the 8 directions the bearing falls into
  const index = Math.floor((normalizedBearing + 22.5) / 45) % 8;

  const Icon = directions[index] || ArrowIcon;

  return <Icon size={size} color={color} />;
}
