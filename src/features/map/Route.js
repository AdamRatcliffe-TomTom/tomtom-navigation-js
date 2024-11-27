import { useEffect, useMemo } from "react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { PathStyleExtension } from "@deck.gl/extensions";
import { v4 as uuid } from "uuid";
import { useLayers } from "./hooks/LayersContext";

const Route = ({
  data,
  routeTravelled,
  routeRemaining,
  walkingLeg,
  before,
  isPedestrianRoute
}) => {
  const id = useMemo(() => `Route-${uuid()}`, []);
  const { addLayer, removeLayer } = useLayers();

  const getLineColor = (feature) => {
    const {
      properties: { magnitudeOfDelay }
    } = feature;

    switch (magnitudeOfDelay) {
      case 1:
        return [255, 193, 5, 255];
      case 2:
        return [251, 45, 9, 255];
      case 3:
        return [173, 0, 0, 255];
      default:
        return [59, 174, 227, 255];
    }
  };

  const memoizedLayers = useMemo(() => {
    if (!data) return null;

    if (isPedestrianRoute) {
      return [
        new GeoJsonLayer({
          id: `${id}--Pedestrian`,
          beforeId: before,
          data: routeRemaining,
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
        }),
        new GeoJsonLayer({
          id: `${id}--Pedestrian--Travelled`,
          beforeId: before,
          data: routeTravelled,
          filled: true,
          stroked: true,
          getLineColor: [33, 75, 100, 255],
          getLineWidth: 8,
          lineWidthMinPixels: 8,
          lineWidthMaxPixels: 12,
          lineWidthUnits: "meters",
          lineCapRounded: true,
          lineJointRounded: true,
          getDashArray: [0.2, 4],
          dashJustified: true,
          extensions: [new PathStyleExtension({ dash: true })]
        })
      ];
    }

    return [
      new GeoJsonLayer({
        id: `${id}--Casing`,
        beforeId: before,
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
      }),
      new GeoJsonLayer({
        id: `${id}--Line`,
        beforeId: before,
        data,
        filled: true,
        stroked: true,
        getLineColor: getLineColor,
        getLineWidth: 6,
        lineWidthMinPixels: 6,
        lineWidthMaxPixels: 13,
        lineWidthUnits: "meters",
        lineCapRounded: true,
        lineJointRounded: true
      }),
      new GeoJsonLayer({
        id: `${id}--Travelled_Casing`,
        beforeId: before,
        data: routeTravelled,
        filled: true,
        stroked: true,
        getLineColor: [33, 75, 100, 255],
        getLineWidth: 9,
        lineWidthMinPixels: 9,
        lineWidthMaxPixels: 16,
        lineWidthUnits: "meters",
        lineCapRounded: true,
        lineJointRounded: true
      }),
      new GeoJsonLayer({
        id: `${id}--Travelled_Line`,
        beforeId: before,
        data: routeTravelled,
        filled: true,
        stroked: true,
        getLineColor: [33, 75, 100, 255],
        getLineWidth: 6,
        lineWidthMinPixels: 6,
        lineWidthMaxPixels: 13,
        lineWidthUnits: "meters",
        lineCapRounded: true,
        lineJointRounded: true
      }),
      new GeoJsonLayer({
        id: `${id}--Walking_Leg`,
        beforeId: before,
        data: walkingLeg,
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
      })
    ];
  }, [
    data,
    routeTravelled,
    routeRemaining,
    walkingLeg,
    before,
    isPedestrianRoute
  ]);

  useEffect(() => {
    if (memoizedLayers) {
      addLayer(memoizedLayers);
    }

    return () => {
      if (memoizedLayers) {
        const layerIds = memoizedLayers.map((layer) => layer.id);
        removeLayer(layerIds);
      }
    };
  }, [memoizedLayers, addLayer, removeLayer]);

  return null;
};

export default Route;
