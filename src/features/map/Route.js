import { useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import _isNil from "lodash.isnil";
import { withMap } from "react-tomtom-maps";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { GeoJsonLayer } from "@deck.gl/layers";
import { PathStyleExtension } from "@deck.gl/extensions";
import { v4 as uuid } from "uuid";

const Route = ({
  map,
  data,
  progress,
  walkingLeg,
  before,
  isPedestrianRoute
}) => {
  const id = useMemo(() => `Route-${uuid()}`, []);
  const controlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const control = new MapboxOverlay({
      interleaved: true,
      layers: []
    });
    controlRef.current = control;

    map.addControl(control);

    return () => {
      try {
        map.removeControl(control);
        controlRef.current = null;
      } catch (e) {
        // Suppress errors during cleanup
      }
    };
  }, [map]);

  useEffect(() => {
    if (controlRef.current) {
      controlRef.current.setProps({
        layers: createLayers()
      });
    }
  }, [data, progress, walkingLeg, before, isPedestrianRoute]);

  const createLayers = () => {
    if (!data) return null;

    if (isPedestrianRoute) {
      return [
        new GeoJsonLayer({
          id: `${id}--Pedestrian_Route`,
          beforeId: before,
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
        })
      ];
    }

    const layers = [
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
        id: `${id}--Progress_Casing`,
        beforeId: before,
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
      }),
      new GeoJsonLayer({
        id: `${id}--Progress_Line`,
        beforeId: before,
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

    return layers;
  };

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

  return null;
};

Route.propTypes = {
  map: PropTypes.object,
  data: PropTypes.object,
  progress: PropTypes.object,
  walkingLeg: PropTypes.object,
  before: PropTypes.string,
  isPedestrianRoute: PropTypes.bool
};

export default withMap(Route);
