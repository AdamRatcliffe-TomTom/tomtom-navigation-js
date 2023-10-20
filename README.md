# TomTom Navigation Component for Power Apps

A navigation PCF component implemented with React and Fluent UI.


## Properties

Available component properties:

| Name                 | Type                                                         | Default value | Description                       |
|----------------------|--------------------------------------------------------------|---------------|-----------------------------------|
| apiKey               | `SingleLine.Text`                                              |               | The TomTom API key.                           |
| theme                | `Enum`possible values are "light", "dark"                   | "light"         | The componnent theme. Influences both the map style and the theme used for the components overlaid on the map.                             |
| showTrafficFlow      | `TwoOptions`                                                   | false         | Show the traffic flow layer.                |
| showTrafficIncidents | `TwoOptions`                                                   | false         | Show the traffic incidents layer.           |
| showPoi              | `TwoOptions`                                                   | false         | Show the POI layer.                           |
| initialCenter        | `SingleLine.Text`                                              |               | Initial map center specifed in the format "latitude,longitude". This is set once when the component is mounted. |
| initialZoom          | `Decimal`                                                      | 12            | Initial zoom level. This is set once when the component is mounted.                |
| showLocationMarker   | `TwoOptions`                                                   | true          | Show location marker for the user's current location.              |
| showZoomControl      | `TwoOptions`                                                   | false         | Show zoom control.                  |
| showMapSwitcherControl | `TwoOptions`                                                 | false         | Show map switcher control.          |
| automaticRouteCalculation | `TwoOptions`                                             | false         | Automatically calculates a route when more than 1 waypoint is provided.       |
| routeWaypoints       | `SingleLine.Text`                                              |               | A list of coordinate pairs, where each coordinate is specified in the format "latitude,longitude" and the pairs are separated with a semicolon character ";".                    |
| travelMode           | `Enum` possible values are "car", "truck", "taxi", "bus", "van", "motorcycle", "bicycle", "pedestrian" | "car" | The travel mode used for the route calculation. |
| traffic              | `TwoOptions`                                                   | true          | Calculates the route using live traffic.      |
| arrivalSidePreference | `Enum` possible values are "anySide", "curbSide"             | "anySide"       | Specifies the preference of roadside on arrival to waypoints and destination. Stop on the road has to be set at least two meters to the preferred side, otherwise the behavior will default to "anySide".            |
| simulationSpeed      | `Enum` possible values are "1x", "2x", "3x", "4x", "5x"     | "3x"            | The simulation speed.                   |


