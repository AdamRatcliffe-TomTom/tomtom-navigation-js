import React, { useState, useEffect, useMemo } from "react";
import { GeoJSONLayer, withMap } from "react-tomtom-maps";
import { point, featureCollection } from "@turf/helpers";
import bearing from "@turf/bearing";

const ManeuverArrows = ({
  map,
  data,
  nextInstructionPointIndex,
  ...otherProps
}) => {
  const [imageReady, setImageReady] = useState(false);

  const filter = [
    "==",
    ["get", "pointIndex"],
    nextInstructionPointIndex || null
  ];

  useEffect(() => {
    if (map) {
      if (!map.hasImage("arrowhead")) {
        const img = new Image(28, 28);
        img.addEventListener("load", () => {
          map.addImage("arrowhead", img);

          // The driving style may not have finished loading when the image is added so
          // listen for the styleimagemissing event as a backup
          map.on("styleimagemissing", ({ id }) => {
            if (id === "arrowhead") {
              map.addImage("arrowhead", img);
            }
          });

          setImageReady(true);
        });
        img.src =
          "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjI4IgogICBoZWlnaHQ9IjI3Ljk5OTk5IgogICB2aWV3Qm94PSIwIDAgMjggMjcuOTk5OTkiCiAgIGZpbGw9Im5vbmUiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzU2OCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzNTcyIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MDtzdHJva2UtZGFzaGFycmF5Om5vbmUiCiAgICAgZD0iTSAxLjEwNDkxODgsMC4wMzkzNDk3NSBDIDAuNDAyMjY0NjMsMC4xODcyODE5MSAtMC4xNDMxNTAxLDEuMDA3Njk3MiAwLjAzMzU0MzEzLDEuNjUwOTE2NyAwLjE2OTQyMTMxLDIuMTQ1NTU0MiAxMi43MDk3NDEsMjcuMzQyMzU5IDEyLjkzOTYxLDI3LjU4MjYwNCBjIDAuMjY3OTkzLDAuMjgwMDg4IDAuNjAyMzEzLDAuNDE3Mzg3IDEuMDE2MzI5LDAuNDE3Mzg3IDAuNzc1MDEyLDAgMS4wMTExOTYsLTAuMjMxMzEyIDEuNzg1MzQzLC0xLjc0ODUyNSBDIDE3LjQwMjk0NSwyMi45OTQ4NTYgMjcuOTM1OTI3LDEuNzgyNDk5MiAyNy45Nzc1NTUsMS42MDg4NTM3IDI4LjEyMjMyMSwxLjAwNDk4NTggMjcuNTQ0NzA3LDAuMTc4OTk4NTggMjYuODgwMzYxLDAuMDM5ODY0MjUgMjYuNjg5Njg1LC01LjkwODIzODdlLTUgMjYuNDI2MzgsLTAuMDA4ODc5MDkgMjYuMjk1MjM3LDAuMDIwMjc1OTEgMjYuMTY0MDk0LDAuMDQ5NDQyNTggMjQuNTA0Mjg1LDAuODIwNzg4OTQgMjIuNjA2NzcsMS43MzQzODgyIDIwLjcwOTI1MywyLjY0Nzk4NjIgMTguODg5NjQzLDMuNTE3MjE4MiAxOC41NjMxODksMy42NjYwMTI0IDE1LjgzNjkzNyw0LjkwODYxMjggMTIuNzQ1NzMsNS4wMDI3Njc0IDEwLjAwNzQyOCwzLjkyNjYxNDMgOS42NTMwNTcxLDMuNzg3MzQ1OCA3LjY3NzA1NTMsMi44NTc1NTQ0IDUuNjE2MzEyNiwxLjg2MDQxMTQgMy41NTU1Njk4LDAuODYzMjY2MSAxLjc2OTM0NiwwLjAzMDQ3MjU4IDEuNjQ2OTI2NSwwLjAwOTc1ODQxIDEuNTI0NTA1OCwtMC4wMTA5NDk5MiAxLjI4MDYwMjUsMC4wMDI0MDg0MSAxLjEwNDkxODgsMC4wMzkzNDUwOCBaIgogICAgIGlkPSJwYXRoMjE3MyIgLz4KPC9zdmc+Cg==";
      } else {
        setImageReady(true);
      }
    }
  }, [map]);

  const arrowHeads = useMemo(() => {
    const { features } = data;
    const arrowHeadFeatures = features.map((feature) => {
      const {
        geometry: { coordinates },
        properties: { pointIndex }
      } = feature;

      const rotation = bearing.apply(
        null,
        coordinates
          .slice(-2)
          .map((coord) => {
            return point(coord);
          })
          .reverse()
      );
      return point(coordinates.at(-1), { rotation, pointIndex });
    });
    return featureCollection(arrowHeadFeatures);
  }, [data]);

  return imageReady ? (
    <>
      <GeoJSONLayer
        data={data}
        linePaint={{
          "line-width": {
            stops: [
              [14, 8],
              [15, 9],
              [16, 10],
              [17, 15],
              [18, 16]
            ]
          },
          "line-color": "#ffffff"
        }}
        lineLayout={{
          "line-join": "round"
        }}
        layerOptions={{
          filter,
          minzoom: 14
        }}
        {...otherProps}
      />
      <GeoJSONLayer
        data={arrowHeads}
        symbolLayout={{
          "icon-image": "arrowhead",
          "icon-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            14,
            0.5,
            16,
            0.875,
            18,
            1,
            20,
            1.125
          ],
          "icon-rotate": {
            type: "identity",
            property: "rotation"
          },
          "icon-anchor": "top",
          "icon-rotation-alignment": "map",
          "icon-offset": [0, -8],
          "icon-allow-overlap": true
        }}
        layerOptions={{
          filter,
          minzoom: 14
        }}
        {...otherProps}
      />
    </>
  ) : null;
};

export default withMap(ManeuverArrows);
