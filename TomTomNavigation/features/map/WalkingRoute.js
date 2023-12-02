import { useState, useEffect } from "react";
import { MapboxLayer } from "@deck.gl/mapbox";
import { GeoJsonLayer } from "@deck.gl/layers";
import { PathStyleExtension } from "@deck.gl/extensions";
import { withMap } from "react-tomtom-maps";
import { v4 as uuid } from "uuid";

const WalkingRoute = ({ map, data, before }) => {
  const [mapIsReady, setMapIsReady] = useState(false);
  const [layer, setLayer] = useState();

  useEffect(() => {
    map.on("load", () => setMapIsReady(true));
  }, []);

  useEffect(() => {
    const layer = new MapboxLayer({
      type: GeoJsonLayer,
      id: uuid(),
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
    map.addLayer(layer, before);
    setLayer(layer);
  }, [mapIsReady]);

  return null;
};

export default withMap(WalkingRoute);
