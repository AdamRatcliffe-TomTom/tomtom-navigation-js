import Maneuvers from "../constants/Maneuvers";
import KeepLeft from "../icons/nip/KeepLeft";
import KeepRight from "../icons/nip/KeepRight";

export default function getNextInstructionIcon(maneuver) {
  return {
    [Maneuvers.KEEP_LEFT]: <KeepLeft />,
    [Maneuvers.KEEP_RIGHT]: <KeepRight />
  }[maneuver];
}
