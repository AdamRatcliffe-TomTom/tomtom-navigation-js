import { useEffect, useRef } from "react";
import useState from "react-usestateref";
import { MapboxLayer } from "@deck.gl/mapbox";
import { GeoJsonLayer } from "@deck.gl/layers";
import { PathStyleExtension } from "@deck.gl/extensions";
import { withMap } from "react-tomtom-maps";
import { v4 as uuid } from "uuid";
import usePrevPropValue from "../../hooks/usePrevPropValue";

const WalkingRoute = ({ map, data, before, mapStyle }) => {
  const idRef = useRef(`WalkingRoute-${uuid()}`);
  const [layer, setLayer, layerRef] = useState();
  const prevMapStyle = usePrevPropValue(mapStyle);

  useEffect(() => {
    addLayers();
  }, []);

  useEffect(() => {
    if (mapStyle !== prevMapStyle) {
      function onStyleData() {
        removeLayers();
        addLayers();
      }
      map.once("styledata", onStyleData);
    }
  }, [mapStyle, prevMapStyle]);

  useEffect(() => {
    if (layer) {
      layer.setProps({ data });
    }
  }, [layer, data]);

  const addLayers = () => {
    const l = new MapboxLayer({
      type: GeoJsonLayer,
      id: idRef.current,
      data,
      filled: true,
      stroked: true,
      getLineColor: [59, 174, 227, 255],
      getLineWidth: 8,
      lineWidthMinPixels: 8,
      lineWidthMaxPixels: 12,
      lineWidthUnits: "meters",
      lineCapRounded: true,
      lineJointRounded: true,
      getDashArray: [0.2, 4],
      dashJustified: true,
      extensions: [new PathStyleExtension({ dash: true })]
    });
    map.addLayer(l, before);

    setLayer(l);
  };

  const removeLayers = () => {
    const id = layerRef.current.id;
    if (map.getLayer(id)) map.removeLayer(id);
  };

  return null;
};

export default withMap(WalkingRoute);
