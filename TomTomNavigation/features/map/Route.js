import React from "react";
import { GeoJSONLayer } from "react-tomtom-maps";

const lineLayout = {
  "line-join": "round",
  "line-cap": "round"
};

const Route = React.memo(({ data, ...otherProps }) => (
  <>
    <GeoJSONLayer
      data={data}
      {...otherProps}
      lineLayout={lineLayout}
      linePaint={{
        "line-width": {
          stops: [
            [8, 7],
            [10, 8],
            [12, 9],
            [14, 11],
            [16, 12],
            [18, 14],
            [20, 16]
          ]
        },
        "line-color": "#0568A8"
      }}
    />
    <GeoJSONLayer
      data={data}
      {...otherProps}
      lineLayout={lineLayout}
      linePaint={{
        "line-width": {
          stops: [
            [8, 4],
            [10, 5],
            [12, 6],
            [14, 8],
            [16, 9],
            [18, 10],
            [20, 13]
          ]
        },
        "line-color": "#3BAEE3"
      }}
    />
  </>
));

export default Route;
