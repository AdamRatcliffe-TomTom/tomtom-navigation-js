import ControlEvents from "../constants/ControlEvents";
import { EVENT_PREFIX } from "../config";

export default function fireEvent(name, data) {
  if (!Object.keys(ControlEvents).includes(name)) {
    throw new Error(`Trying to fire an unsupported event '${name}'`);
  }

  const message = {
    type: `${EVENT_PREFIX}.${name}`,
    ...data
  };

  window.postMessage(message);
}
