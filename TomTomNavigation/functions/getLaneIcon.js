import React from "react";

import StraightIcon from "../icons/nip/StraightIcon";
import BearLeftIcon from "../icons/nip/BearLeftIcon";
import TurnLeftIcon from "../icons/nip/TurnLeftIcon";
import SharpLeftIcon from "../icons/nip/SharpLeftIcon";
import BearRightIcon from "../icons/nip/BearRightIcon";
import TurnRightIcon from "../icons/nip/TurnRightIcon";
import SharpRightIcon from "../icons/nip/SharpRightIcon";
import UTurnIcon from "../icons/nip/UTurnIcon";

export default function getLaneIcon(direction) {
  return {
    STRAIGHT: <StraightIcon />,
    SLIGHT_LEFT: <BearLeftIcon />,
    LEFT: <TurnLeftIcon />,
    SHARP_LEFT: <SharpLeftIcon />,
    SLIGHT_RIGHT: <BearRightIcon />,
    RIGHT: <TurnRightIcon />,
    SHARP_RIGHT: <SharpRightIcon />,
    LEFT_UTURN: <UTurnIcon />,
    RIGHT_UTURN: <UTurnIcon />
  }[direction];
}
