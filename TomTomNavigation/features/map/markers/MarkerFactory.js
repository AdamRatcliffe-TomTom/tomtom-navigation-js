import DefaultMarker from "./DefaultMarker";
import ImageMarker from "./ImageMarker";

function createMarker(props) {
  const { id, icon } = props;
  const Marker = icon ? ImageMarker : DefaultMarker;

  return <Marker key={id} {...props} />;
}

export default {
  createMarker
};
