import { intervalToDuration, formatDuration } from "date-fns";

const formatDistanceLocale = {
  xMinutes: "{{count}} min",
  xHours: "{{count}} hr"
};
const shortEnLocale = {
  formatDistance: (token, count) =>
    formatDistanceLocale[token].replace("{{count}}", count)
};

export default function (seconds) {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  return formatDuration(duration, {
    format: ["hours", "minutes"],
    locale: shortEnLocale
  });
}
