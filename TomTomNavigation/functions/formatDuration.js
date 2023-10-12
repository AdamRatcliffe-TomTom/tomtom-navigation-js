import moment from "moment";
import "moment-duration-format";

export default function formatDuration(timeInSeconds) {
  return moment.duration(timeInSeconds, "seconds").format("h:mm");
}
