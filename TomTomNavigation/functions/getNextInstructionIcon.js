import Maneuvers from "../constants/Maneuvers";
import KeepLeft from "../icons/nip/KeepLeft";

export default function getNextInstructionIcon(maneuver) {
  return {
    [Maneuvers.KEEP_LEFT]: <KeepLeft />
  }[maneuver];
}
