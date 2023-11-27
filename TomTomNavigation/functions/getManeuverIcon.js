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
import DestinationIcon from "../icons/nip/DestinationIcon";
import DestinationLeftIcon from "../icons/nip/DestinationLeftIcon";
import DestinationRightIcon from "../icons/nip/DestinationRightIcon";

export default function getManeuverIcon(
  maneuver,
  { size = 56, color = "white" } = {}
) {
  return {
    [Maneuvers.STRAIGHT]: <StraightIcon size={size} color={color} />,
    [Maneuvers.KEEP_LEFT]: <KeepLeftIcon size={size} color={color} />,
    [Maneuvers.TURN_LEFT]: <TurnLeftIcon size={size} color={color} />,
    [Maneuvers.BEAR_LEFT]: <BearLeftIcon size={size} color={color} />,
    [Maneuvers.SHARP_LEFT]: <SharpLeftIcon size={size} color={color} />,
    [Maneuvers.MOTORWAY_EXIT_LEFT]: <TurnLeftIcon size={size} color={color} />,
    [Maneuvers.KEEP_RIGHT]: <KeepRightIcon size={size} color={color} />,
    [Maneuvers.TURN_RIGHT]: <TurnRightIcon size={size} color={color} />,
    [Maneuvers.BEAR_RIGHT]: <BearRightIcon size={size} color={color} />,
    [Maneuvers.SHARP_RIGHT]: <SharpRightIcon size={size} color={color} />,
    [Maneuvers.MOTORWAY_EXIT_RIGHT]: (
      <TurnRightIcon size={size} color={color} />
    ),
    [Maneuvers.MAKE_UTURN]: <UTurnIcon size={size} color={color} />,
    [Maneuvers.TRY_MAKE_UTURN]: <UTurnIcon size={size} color={color} />,
    [Maneuvers.TAKE_FERRY]: <FerryIcon color={color} />,
    [Maneuvers.ROUNDABOUT_CROSS]: (
      <RoundaboutCrossIcon size={size} color={color} />
    ),
    [Maneuvers.ROUNDABOUT_LEFT]: (
      <RoundaboutLeftIcon size={size} color={color} />
    ),
    [Maneuvers.ROUNDABOUT_RIGHT]: (
      <RoundaboutRightIcon size={size} color={color} />
    ),
    [Maneuvers.ROUNDABOUT_BACK]: <RoundaboutAround size={size} color={color} />,
    [Maneuvers.FOLLOW]: <StraightIcon size={size} color={color} />,
    [Maneuvers.ARRIVE]: <DestinationIcon size={size} color={color} />,
    [Maneuvers.ARRIVE_LEFT]: <DestinationLeftIcon size={size} color={color} />,
    [Maneuvers.ARRIVE_RIGHT]: <DestinationRightIcon size={size} color={color} />
  }[maneuver];
}
