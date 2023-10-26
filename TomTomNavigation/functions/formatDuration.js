import moment from "moment";
import "moment-duration-format";

export default function formatDuration(timeInSeconds) {
  const duration = moment.duration(timeInSeconds, "seconds").format("h:mm");
  return duration > 3600 ? `${duration} hr` : `${duration} min`;
}
