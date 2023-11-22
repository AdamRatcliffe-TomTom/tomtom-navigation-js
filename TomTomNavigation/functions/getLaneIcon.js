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
    STRAIGHT: <StraightIcon size={48} />,
    SLIGHT_LEFT: <BearLeftIcon size={48} />,
    LEFT: <TurnLeftIcon size={48} />,
    SHARP_LEFT: <SharpLeftIcon size={48} />,
    SLIGHT_RIGHT: <BearRightIcon size={48} />,
    RIGHT: <TurnRightIcon size={48} />,
    SHARP_RIGHT: <SharpRightIcon size={48} />,
    LEFT_UTURN: <UTurnIcon size={48} />,
    RIGHT_UTURN: <UTurnIcon size={48} />
  }[direction];
}
