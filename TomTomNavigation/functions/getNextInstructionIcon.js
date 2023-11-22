import Maneuvers from "../constants/Maneuvers";
import StraightIcon from "../icons/nip/StraightIcon";
import KeepLeftIcon from "../icons/nip/KeepLeftIcon";
import TurnLeftIcon from "../icons/nip/TurnLeftIcon";
import BearLeftIcon from "../icons/nip/BearLeftIcon";
import SharpLeftIcon from "../icons/nip/SharpLeftIcon";
import KeepRightIcon from "../icons/nip/KeepRightIcon";
import TurnRightIcon from "../icons/nip/TurnRightIcon";
import BearRightIcon from "../icons/nip/BearRightIcon";
import SharpRightIcon from "../icons/nip/SharpRightIcon";
import UTurnIcon from "../icons/nip/UTurnIcon";
import FerryIcon from "../icons/nip/FerryIcon";
import RoundaboutCrossIcon from "../icons/nip/RoundaboutCrossIcon";
import RoundaboutLeftIcon from "../icons/nip/RoundaboutLeftIcon";
import RoundaboutRightIcon from "../icons/nip/RoundaboutRightIcon";
import RoundaboutAround from "../icons/nip/RoundaboutAround";

export default function getNextInstructionIcon(maneuver) {
  return {
    [Maneuvers.STRAIGHT]: <StraightIcon />,
    [Maneuvers.KEEP_LEFT]: <KeepLeftIcon />,
    [Maneuvers.TURN_LEFT]: <TurnLeftIcon />,
    [Maneuvers.BEAR_LEFT]: <BearLeftIcon />,
    [Maneuvers.SHARP_LEFT]: <SharpLeftIcon />,
    [Maneuvers.MOTORWAY_EXIT_LEFT]: <TurnLeftIcon />,
    [Maneuvers.KEEP_RIGHT]: <KeepRightIcon />,
    [Maneuvers.TURN_RIGHT]: <TurnRightIcon />,
    [Maneuvers.BEAR_RIGHT]: <BearRightIcon />,
    [Maneuvers.SHARP_RIGHT]: <SharpRightIcon />,
    [Maneuvers.MOTORWAY_EXIT_RIGHT]: <TurnRightIcon />,
    [Maneuvers.MAKE_UTURN]: <UTurnIcon />,
    [Maneuvers.TRY_MAKE_UTURN]: <UTurnIcon />,
    [Maneuvers.TAKE_FERRY]: <FerryIcon />,
    [Maneuvers.ROUNDABOUT_CROSS]: <RoundaboutCrossIcon />,
    [Maneuvers.ROUNDABOUT_LEFT]: <RoundaboutLeftIcon />,
    [Maneuvers.ROUNDABOUT_RIGHT]: <RoundaboutRightIcon />,
    [Maneuvers.ROUNDABOUT_BACK]: <RoundaboutAround />,
    [Maneuvers.FOLLOW]: <StraightIcon />
  }[maneuver];
}
