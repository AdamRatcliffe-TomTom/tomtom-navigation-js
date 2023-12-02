import { useEffect, useRef } from "react";
import useState from "react-usestateref";
import { MapboxLayer } from "@deck.gl/mapbox";
import { GeoJsonLayer } from "@deck.gl/layers";
import { withMap } from "react-tomtom-maps";
import { v4 as uuid } from "uuid";
import usePrevPropValue from "../../hooks/usePrevPropValue";

function getLineColor(feature) {
  const {
    properties: { magnitudeOfDelay }
  } = feature;

  switch (magnitudeOfDelay) {
    case 1:
      return [241, 191, 64, 255];
    case 2:
      return [241, 130, 55, 255];
    case 3:
      return [231, 7, 4, 255];
    default:
      return [59, 174, 227, 255];
  }
}

const Route = ({ map, data, progress, before, mapStyle }) => {
  const idRef = useRef(`Route-${uuid()}`);
  const [layers, setLayers, layersRef] = useState({});
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
    if (layers && data) {
      layers.routeCasing?.setProps({ data });
      layers.routeLine?.setProps({ data });
    }
  }, [layers, data]);

  useEffect(() => {
    if (layers && progress) {
      layers.routeProgressCasing?.setProps({ data: progress });
      layers.routeProgressLine?.setProps({ data: progress });
    }
  }, [layers, progress]);

  const addLayers = () => {
    const routeCasingLayer = new MapboxLayer({
      type: GeoJsonLayer,
      id: `${idRef.current}--Casing`,
      data,
      filled: true,
      stroked: true,
      getLineColor: [5, 104, 168, 255],
      getLineWidth: 9,
      lineWidthMinPixels: 9,
      lineWidthMaxPixels: 16,
      lineWidthUnits: "meters",
      lineCapRounded: true,
      lineJointRounded: true
    });
    map.addLayer(routeCasingLayer, before);

    const routeLineLayer = new MapboxLayer({
      type: GeoJsonLayer,
      id: `${idRef.current}--Line`,
      data,
      filled: true,
      stroked: true,
      getLineColor,
      getLineWidth: 6,
      lineWidthMinPixels: 6,
      lineWidthMaxPixels: 13,
      lineWidthUnits: "meters",
      lineCapRounded: true,
      lineJointRounded: true
    });
    map.addLayer(routeLineLayer, before);

    const routeProgressCasingLayer = new MapboxLayer({
      type: GeoJsonLayer,
      id: `${idRef.current}--Progress_Casing`,
      data: progress,
      filled: true,
      stroked: true,
      getLineColor: [33, 75, 100, 255],
      getLineWidth: 9,
      lineWidthMinPixels: 9,
      lineWidthMaxPixels: 16,
      lineWidthUnits: "meters",
      lineCapRounded: true,
      lineJointRounded: true
    });
    map.addLayer(routeProgressCasingLayer, before);

    const routeProgressLineLayer = new MapboxLayer({
      type: GeoJsonLayer,
      id: `${idRef.current}--Progress_Line`,
      data: progress,
      filled: true,
      stroked: true,
      getLineColor: [33, 75, 100, 255],
      getLineWidth: 6,
      lineWidthMinPixels: 6,
      lineWidthMaxPixels: 13,
      lineWidthUnits: "meters",
      lineCapRounded: true,
      lineJointRounded: true
    });
    map.addLayer(routeProgressLineLayer, before);

    setLayers({
      routeCasing: routeCasingLayer,
      routeLine: routeLineLayer,
      routeProgressCasing: routeProgressCasingLayer,
      routeProgressLine: routeProgressLineLayer
    });
  };

  const removeLayers = () => {
    Object.values(layersRef.current).forEach(({ id }) => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
  };

  return null;
};

export default withMap(Route);
