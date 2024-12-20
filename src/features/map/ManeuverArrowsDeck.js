import { useEffect, useMemo, useState } from "react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { point, featureCollection } from "@turf/helpers";
import bearing from "@turf/bearing";
import { useLayers } from "./hooks/LayersContext";
import rasterizeSVG from "../../functions/rasterizeSVG";

const ManeuverArrows = ({ data, nextInstructionPointIndex, before }) => {
  const id = "ManeuverArrows";
  const { addLayer, removeLayer } = useLayers();
  const [arrowHeadGeoJson, setArrowHeadGeoJson] = useState(null);
  const [filteredLineGeoJson, setFilteredLineGeoJson] = useState(null);
  const [rasterizedArrow, setRasterizedArrow] = useState(null);

  useEffect(() => {
    const computeArrowData = async () => {
      const { features } = data;

      const filteredFeatures = features.filter(
        (feature) =>
          nextInstructionPointIndex === undefined ||
          nextInstructionPointIndex === null ||
          feature.properties.pointIndex === nextInstructionPointIndex
      );

      const arrowHeadFeatures = filteredFeatures.map((feature) => {
        const {
          geometry: { coordinates },
          properties: { pointIndex }
        } = feature;

        const rotation = bearing(
          point(coordinates[coordinates.length - 2]),
          point(coordinates[coordinates.length - 1])
        );

        return point(coordinates[coordinates.length - 1], {
          rotation,
          pointIndex
        });
      });

      setFilteredLineGeoJson(featureCollection(filteredFeatures));
      setArrowHeadGeoJson(featureCollection(arrowHeadFeatures));

      if (!rasterizedArrow) {
        const arrow = await rasterizeSVG(
          "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjI4IgogICBoZWlnaHQ9IjI3Ljk5OTk5IgogICB2aWV3Qm94PSIwIDAgMjggMjcuOTk5OTkiCiAgIGZpbGw9Im5vbmUiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzU2OCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzNTcyIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MDtzdHJva2UtZGFzaGFycmF5Om5vbmUiCiAgICAgZD0iTSAxLjEwNDkxODgsMC4wMzkzNDk3NSBDIDAuNDAyMjY0NjMsMC4xODcyODE5MSAtMC4xNDMxNTAxLDEuMDA3Njk3MiAwLjAzMzU0MzEzLDEuNjUwOTE2NyAwLjE2OTQyMTMxLDIuMTQ1NTU0MiAxMi43MDk3NDEsMjcuMzQyMzU5IDEyLjkzOTYxLDI3LjU4MjYwNCBjIDAuMjY3OTkzLDAuMjgwMDg4IDAuNjAyMzEzLDAuNDE3Mzg3IDEuMDE2MzI5LDAuNDE3Mzg3IDAuNzc1MDEyLDAgMS4wMTExOTYsLTAuMjMxMzEyIDEuNzg1MzQzLC0xLjc0ODUyNSBDIDE3LjQwMjk0NSwyMi45OTQ4NTYgMjcuOTM1OTI3LDEuNzgyNDk5MiAyNy45Nzc1NTUsMS42MDg4NTM3IDI4LjEyMjMyMSwxLjAwNDk4NTggMjcuNTQ0NzA3LDAuMTc4OTk4NTggMjYuODgwMzYxLDAuMDM5ODY0MjUgMjYuNjg5Njg1LC01LjkwODIzODdlLTUgMjYuNDI2MzgsLTAuMDA4ODc5MDkgMjYuMjk1MjM3LDAuMDIwMjc1OTEgMjYuMTY0MDk0LDAuMDQ5NDQyNTggMjQuNTA0Mjg1LDAuODIwNzg4OTQgMjIuNjA2NzcsMS43MzQzODgyIDIwLjcwOTI1MywyLjY0Nzk4NjIgMTguODg5NjQzLDMuNTE3MjE4MiAxOC41NjMxODksMy42NjYwMTI0IDE1LjgzNjkzNyw0LjkwODYxMjggMTIuNzQ1NzMsNS4wMDI3Njc0IDEwLjAwNzQyOCwzLjkyNjYxNDMgOS42NTMwNTcxLDMuNzg3MzQ1OCA3LjY3NzA1NTMsMi44NTc1NTQ0IDUuNjE2MzEyNiwxLjg2MDQxMTQgMy41NTU1Njk4LDAuODYzMjY2MSAxLjc2OTM0NiwwLjAzMDQ3MjU4IDEuNjQ2OTI2NSwwLjAwOTc1ODQxIDEuNTI0NTA1OCwtMC4wMTA5NDk5MiAxLjI4MDYwMjUsMC4wMDI0MDg0MSAxLjEwNDkxODgsMC4wMzkzNDUwOCBaIgogICAgIGlkPSJwYXRoMjE3MyIgLz4KPC9zdmc+Cg==",
          28,
          28
        );
        setRasterizedArrow(arrow);
      }
    };

    computeArrowData();
  }, [data, nextInstructionPointIndex, rasterizedArrow]);

  const memoizedLayers = useMemo(() => {
    if (!arrowHeadGeoJson || !rasterizedArrow) return null;

    return [
      new GeoJsonLayer({
        id: `${id}-arrow-heads`,
        data: arrowHeadGeoJson,
        beforeId: before,
        pointType: "icon",
        getIcon: () => ({
          url: rasterizedArrow,
          width: 28,
          height: 28
        }),
        getIconAngle: (d) => 180 - d.properties.rotation,
        getIconSize: 28,
        iconBillboard: false,
        sizeUnits: "pixels",
        parameters: {
          depthTest: false
        }
      }),
      new GeoJsonLayer({
        id: `${id}-arrow-lines`,
        data: filteredLineGeoJson,
        beforeId: before,
        stroked: true,
        filled: true,
        getLineColor: [255, 255, 255, 255],
        getLineWidth: 6,
        lineWidthMinPixels: 6,
        lineWidthMaxPixels: 13,
        parameters: {
          depthTest: false
        }
      })
    ];
  }, [filteredLineGeoJson, arrowHeadGeoJson, rasterizedArrow, id, before]);

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

export default ManeuverArrows;
