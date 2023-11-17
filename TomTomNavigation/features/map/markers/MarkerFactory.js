import DefaultMarker from "./DefaultMarker";
import ImageMarker from "./ImageMarker";

function createMarker(props) {
  const { id, icon } = props;
  const Marker = icon ? ImageMarker : DefaultMarker;

  console.log("props: ", props);

  return <Marker key={id} {...props} />;
}

export default {
  createMarker
};
