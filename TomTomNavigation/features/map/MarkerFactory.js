import DefaultMarker from "./DefaultMarker";

function createMarker(props) {
  const { id, lng, lat } = props;
  const coordinates = [lng, lat];

  return <DefaultMarker key={id} coordinates={coordinates} />;
}

export default {
  createMarker
};
