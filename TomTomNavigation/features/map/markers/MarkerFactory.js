import DefaultMarker from "./DefaultMarker";
import ImageMarker from "./ImageMarker";

function createMarker(props) {
  const { id, coordinates, ...otherProps } = props;
  const Marker = otherProps.iconUrl ? ImageMarker : DefaultMarker;

  return <Marker key={id} coordinates={coordinates} {...otherProps} />;
}

export default {
  createMarker
};
