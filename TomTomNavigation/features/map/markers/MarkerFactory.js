import DefaultMarker from "./DefaultMarker";
import ImageMarker from "./ImageMarker";

function createMarker(props) {
  const { id, lng, lat, ...otherProps } = props;
  const coordinates = [lng, lat];
  const Marker = otherProps.iconUrl ? ImageMarker : DefaultMarker;

  return <Marker key={id} coordinates={coordinates} {...otherProps} />;
}

export default {
  createMarker
};
