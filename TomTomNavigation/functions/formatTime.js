import { format } from "date-fns";

export default function formatTime(date) {
  const hours = date.getHours();
  const time = format(date, "h:mm");
  const meridiem = hours >= 12 ? "PM" : "AM";
  return { time, meridiem };
}
