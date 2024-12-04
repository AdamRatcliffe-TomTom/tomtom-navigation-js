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
import strings from "../config/strings";

export default function getDirectionIcon(
  direction,
  { size = 48, color = "white" } = {}
) {
  const icons = {
    [strings.north]: NorthIcon,
    [strings.northEast]: NorthEastIcon,
    [strings.east]: EastIcon,
    [strings.southEast]: SouthEastIcon,
    [strings.south]: SouthIcon,
    [strings.southWest]: SouthWestIcon,
    [strings.west]: WestIcon,
    [strings.northWest]: NorthWestIcon
  };

  const Icon = icons[direction] || ArrowIcon;

  return <Icon size={size} color={color} />;
}
