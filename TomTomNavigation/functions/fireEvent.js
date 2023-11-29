import ComponentEvents from "../constants/ComponentEvents";

const EVENT_PREFIX = "TomTomNavigation";

export default function fireEvent(name, data) {
  if (!Object.keys(ComponentEvents).includes(name)) {
    throw new Error(`Trying to fire an unsupported event '${name}'`);
  }

  const message = {
    type: `${EVENT_PREFIX}.${name}`,
    ...data
  };

  window.postMessage(message);
}
