import React, { useEffect, useMemo } from "react";
import { GeoJSONLayer, withMap } from "react-tomtom-maps";
import { point, featureCollection } from "@turf/helpers";
import bearing from "@turf/bearing";

const ManeuverArrows = ({
  map,
  data,
  nextInstructionPointIndex,
  ...otherProps
}) => {
  const filter = [
    "==",
    ["get", "pointIndex"],
    nextInstructionPointIndex || null
  ];

  useEffect(() => {
    if (map) {
      const addImageToMap = (id, url, size = 28) => {
        if (!map.hasImage(id)) {
          const img = new Image(size, size);
          img.addEventListener("load", () => {
            if (!map.hasImage(id)) {
              map.addImage(id, img);

              const handleStyleImageMissing = ({ id: imageId }) => {
                if (imageId === id && !map.hasImage(imageId)) {
                  map.addImage(id, img);
                }
              };

              // Listen for the styleimagemissing event as a backup
              map.on("styleimagemissing", handleStyleImageMissing);
            }
          });
          img.src = url;
        }
      };

      addImageToMap(
        "arrowhead",
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjI4IgogICBoZWlnaHQ9IjI3Ljk5OTk5IgogICB2aWV3Qm94PSIwIDAgMjggMjcuOTk5OTkiCiAgIGZpbGw9Im5vbmUiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzU2OCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzNTcyIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MDtzdHJva2UtZGFzaGFycmF5Om5vbmUiCiAgICAgZD0iTSAxLjEwNDkxODgsMC4wMzkzNDk3NSBDIDAuNDAyMjY0NjMsMC4xODcyODE5MSAtMC4xNDMxNTAxLDEuMDA3Njk3MiAwLjAzMzU0MzEzLDEuNjUwOTE2NyAwLjE2OTQyMTMxLDIuMTQ1NTU0MiAxMi43MDk3NDEsMjcuMzQyMzU5IDEyLjkzOTYxLDI3LjU4MjYwNCBjIDAuMjY3OTkzLDAuMjgwMDg4IDAuNjAyMzEzLDAuNDE3Mzg3IDEuMDE2MzI5LDAuNDE3Mzg3IDAuNzc1MDEyLDAgMS4wMTExOTYsLTAuMjMxMzEyIDEuNzg1MzQzLC0xLjc0ODUyNSBDIDE3LjQwMjk0NSwyMi45OTQ4NTYgMjcuOTM1OTI3LDEuNzgyNDk5MiAyNy45Nzc1NTUsMS42MDg4NTM3IDI4LjEyMjMyMSwxLjAwNDk4NTggMjcuNTQ0NzA3LDAuMTc4OTk4NTggMjYuODgwMzYxLDAuMDM5ODY0MjUgMjYuNjg5Njg1LC01LjkwODIzODdlLTUgMjYuNDI2MzgsLTAuMDA4ODc5MDkgMjYuMjk1MjM3LDAuMDIwMjc1OTEgMjYuMTY0MDk0LDAuMDQ5NDQyNTggMjQuNTA0Mjg1LDAuODIwNzg4OTQgMjIuNjA2NzcsMS43MzQzODgyIDIwLjcwOTI1MywyLjY0Nzk4NjIgMTguODg5NjQzLDMuNTE3MjE4MiAxOC41NjMxODksMy42NjYwMTI0IDE1LjgzNjkzNyw0LjkwODYxMjggMTIuNzQ1NzMsNS4wMDI3Njc0IDEwLjAwNzQyOCwzLjkyNjYxNDMgOS42NTMwNTcxLDMuNzg3MzQ1OCA3LjY3NzA1NTMsMi44NTc1NTQ0IDUuNjE2MzEyNiwxLjg2MDQxMTQgMy41NTU1Njk4LDAuODYzMjY2MSAxLjc2OTM0NiwwLjAzMDQ3MjU4IDEuNjQ2OTI2NSwwLjAwOTc1ODQxIDEuNTI0NTA1OCwtMC4wMTA5NDk5MiAxLjI4MDYwMjUsMC4wMDI0MDg0MSAxLjEwNDkxODgsMC4wMzkzNDUwOCBaIgogICAgIGlkPSJwYXRoMjE3MyIgLz4KPC9zdmc+Cg==",
        28
      );

      addImageToMap(
        "arrowhead-outline",
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjI4IgogICBoZWlnaHQ9IjI3Ljk5OTk5IgogICB2aWV3Qm94PSIwIDAgMjggMjcuOTk5OTkiCiAgIGZpbGw9Im5vbmUiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzU2OCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzNTcyIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6cmdiKDMzLCA3NSwgMTAwKTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MDtzdHJva2UtZGFzaGFycmF5Om5vbmUiCiAgICAgZD0iTSAxLjEwNDkxODgsMC4wMzkzNDk3NSBDIDAuNDAyMjY0NjMsMC4xODcyODE5MSAtMC4xNDMxNTAxLDEuMDA3Njk3MiAwLjAzMzU0MzEzLDEuNjUwOTE2NyAwLjE2OTQyMTMxLDIuMTQ1NTU0MiAxMi43MDk3NDEsMjcuMzQyMzU5IDEyLjkzOTYxLDI3LjU4MjYwNCBjIDAuMjY3OTkzLDAuMjgwMDg4IDAuNjAyMzEzLDAuNDE3Mzg3IDEuMDE2MzI5LDAuNDE3Mzg3IDAuNzc1MDEyLDAgMS4wMTExOTYsLTAuMjMxMzEyIDEuNzg1MzQzLC0xLjc0ODUyNSBDIDE3LjQwMjk0NSwyMi45OTQ4NTYgMjcuOTM1OTI3LDEuNzgyNDk5MiAyNy45Nzc1NTUsMS42MDg4NTM3IDI4LjEyMjMyMSwxLjAwNDk4NTggMjcuNTQ0NzA3LDAuMTc4OTk4NTggMjYuODgwMzYxLDAuMDM5ODY0MjUgMjYuNjg5Njg1LC01LjkwODIzODdlLTUgMjYuNDI2MzgsLTAuMDA4ODc5MDkgMjYuMjk1MjM3LDAuMDIwMjc1OTEgMjYuMTY0MDk0LDAuMDQ5NDQyNTggMjQuNTA0Mjg1LDAuODIwNzg4OTQgMjIuNjA2NzcsMS43MzQzODgyIDIwLjcwOTI1MywyLjY0Nzk4NjIgMTguODg5NjQzLDMuNTE3MjE4MiAxOC41NjMxODksMy42NjYwMTI0IDE1LjgzNjkzNyw0LjkwODYxMjggMTIuNzQ1NzMsNS4wMDI3Njc0IDEwLjAwNzQyOCwzLjkyNjYxNDMgOS42NTMwNTcxLDMuNzg3MzQ1OCA3LjY3NzA1NTMsMi44NTc1NTQ0IDUuNjE2MzEyNiwxLjg2MDQxMTQgMy41NTU1Njk4LDAuODYzMjY2MSAxLjc2OTM0NiwwLjAzMDQ3MjU4IDEuNjQ2OTI2NSwwLjAwOTc1ODQxIDEuNTI0NTA1OCwtMC4wMTA5NDk5MiAxLjI4MDYwMjUsMC4wMDI0MDg0MSAxLjEwNDkxODgsMC4wMzkzNDUwOCBaIgogICAgIGlkPSJwYXRoMjE3MyIgLz4KPC9zdmc+Cg==",
        30
      );
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

  return (
    <>
      <GeoJSONLayer
        data={data}
        linePaint={{
          "line-width": {
            stops: [
              [14, 9],
              [15, 10],
              [16, 11],
              [17, 16],
              [18, 17]
            ]
          },
          "line-color": "rgb(33, 75, 100)"
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
          "icon-image": "arrowhead-outline",
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
          "icon-offset": [0, -9],
          "icon-allow-overlap": true
        }}
        layerOptions={{
          filter,
          minzoom: 14
        }}
        {...otherProps}
      />
      <GeoJSONLayer
        data={data}
        linePaint={{
          "line-width": {
            stops: [
              [14, 7],
              [15, 8],
              [16, 9],
              [17, 14],
              [18, 15]
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
  );
};

export default withMap(ManeuverArrows);
