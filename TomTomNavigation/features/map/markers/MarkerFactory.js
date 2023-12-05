import DefaultMarker from "./DefaultMarker";
import ImageMarker from "./ImageMarker";
import { v4 as uuid } from "uuid";

function createMarker(props) {
  const { id, icon } = props;
  const Marker = icon ? ImageMarker : DefaultMarker;

  return <Marker key={id || uuid()} {...props} />;
}

export default {
  createMarker
};
