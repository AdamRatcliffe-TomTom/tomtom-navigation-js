# TomTom Navigation Component for Power Apps

A navigation PCF component implemented with React and Fluent UI.

## Development

1. Install [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable) if needed.
2. From the project root directory run `yarn` to install project dependencies.
3. Run `yarn start:watch` to run component in a local sandbox.

## Component Properties

Available component properties:

| Name                      | Type                                                                                                   | Usage | Default value        | Description                                                                                                                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------ | ----- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| apiKey                    | `SingleLine.Text`                                                                                      | input |                      | The TomTom API key.                                                                                                                                                                                                                                     |
| language                  | `SingleLine.Text`                                                                                      | input | `navigator.language` | Language used for the map and guidance instructions. An [IETF language code tag](https://datahub.io/core/language-codes). When the language provided is one of "en" or "nl" it will also apply to the component UI controls.                            |
| measurementSystem         | `Enum` possible values are "metric", "imperial" and "auto"                                             | input | "auto"               | The measurement system. If "auto" is selected the measurement system will be based on the route location.                                                                                                                                               |
| theme                     | `Enum`possible values are "light", "dark" and "auto"                                                   | input | "auto"               | The componnent theme. Influences both the map style and the theme used for the components overlaid on the map. If "auto" is selected will use the `prefers-color-scheme` media feature to detect if the user has requested light or dark color schemes. |
| showTrafficFlow           | `TwoOptions`                                                                                           | input | `false`                | Show the traffic flow layer.                                                                                                                                                                                                                            |
| showTrafficIncidents      | `TwoOptions`                                                                                           | input | `false`                | Show the traffic incidents layer.                                                                                                                                                                                                                       |
| showPoi                   | `TwoOptions`                                                                                           | input | `false`                | Show the POI layer.                                                                                                                                                                                                                                     |
| initialCenter             | `SingleLine.Text`                                                                                      | input |                      | Initial map center specifed in the format "longitude,latitude". This is set once when the component is mounted.                                                                                                                                         |
| initialZoom               | `Decimal`                                                                                              | input | 12                   | Initial zoom level. This is set once when the component is mounted.                                                                                                                                                                                     |
| showLocationMarker        | `TwoOptions`                                                                                           | input | `true`                 | Show a location marker for the user's current location.                                                                                                                                                                                                 |
|                           |
| showMapSwitcherControl    | `TwoOptions`                                                                                           | input | `true`                 | Show the map switcher control.                                                                                                                                                                                                                          |
| showMuteControl           | `TwoOptions`                                                                                           | input | `true`                 | Show the mute control.                                                                                                                                                                                                                                  |
| showBottomPanel           | `TwoOptions`                                                                                           | input | `true`                 | Show the bottom panel.                                                                                                                                                                                                                                  |
| showGuidancePanel         | `TwoOptions`                                                                                           | input | `true`                 | Show the navigation guidance panel.                                                                                                                                                                                                                     |
| automaticRouteCalculation | `TwoOptions`                                                                                           | input | `false`                | Automatically calculates a route when more than 1 waypoint is provided.                                                                                                                                                                                 |
| travelMode                | `Enum` possible values are "car", "truck", "taxi", "bus", "van", "motorcycle", "bicycle", "pedestrian" | input | "car"                | The travel mode used for the route calculation.                                                                                                                                                                                                         |
| traffic                   | `TwoOptions`                                                                                           | input | `true`                 | Calculates the route using live traffic.                                                                                                                                                                                                                |
| arrivalSidePreference     | `Enum` possible values are "anySide", "curbSide"                                                       | input | "anySide"            | Specifies the preference of roadside on arrival to waypoints and destination. Stop on the road has to be set at least two meters to the preferred side, otherwise the behavior will default to "anySide".                                               |
| guidanceVoice             | `SingleLine.Text`                                                                                      | input |                      | The name of a text-to-speech voice provided by the Microsoft Speech Service. Available voices can be found [here](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts#standard-voices).                        |
| simulationSpeed           | `Enum` possible values are "1x", "2x", "3x", "4x", "5x"                                                | input | "3x"                 | The navigation simulation speed.                                                                                                                                                                                                                        |
| routeWaypoints            | `DataSet`                                                                                              | input |                      | References a `DataSet` containing records for each of the route's waypoints. See description of the `Waypoint` record below.                                                                                                                            |
| routeWaypointsLongitude | `SingleLine.Text` | input | "" | Column in the bound dataset containing the longitude value. |
| routeWaypointsLatitude | `SingleLine.Text` | input | "" | Column in the bound dataset containing the latitude value. |
| routeWaypointsName | `SingleLine.Text` | input | "" | Column in the bound dataset containing the name value. |
| routeWaypointsAddress | `SingleLine.Text` | input | "" | Column in the bound dataset containing the address value. |
| routeWaypointsIconUrl | `SingleLine.Text` | input | "" | Column in the bound dataset containing the icon_url value. |
| routeWaypointsIconWidth | `SingleLine.Text` | input | "" | Column in the bound dataset containing the icon_width value. |
| routeWaypointsIconHeight | `SingleLine.Text` | input | "" | Column in the bound dataset containing the icon_height value. |
| routeWaypointsIcon_anchor | `SingleLine.Text` | input | "" | Column in the bound dataset containing the icon anchor value. |
| routeWaypointsIconOffsetX | `SingleLine.Text` | input | "" | Column in the bound dataset containing the icon_offset_x value. |
| routeWaypointsIconOffsetY | `SingleLine.Text` | input | "" | Column in the bound dataset containing the icon_offset_y value. |
| componentExit | `TwoOptions` | output | `false` | Set to `true` when the component exit button is clicked. |
| navigationState | `Enum` possible values are "NAVIGATION\_NOT\_STARTED", "NAVIGATION\_STARTED", "NAVIGATION\_STOPPED", "DESTINATION\_REACHED" | output | "NAVIGATION\_NOT\_STARTED" | Set by the component to reflect the current navigation state. |

## Route Waypoints

The navigation component sources the route waypoints from a `DataSet`. The dataset must have `lng` and `lat` columns, other columns are optional.

| Name          | Type              | Required | Description                                                                                                                                                                                                               |
| ------------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| latitude      | `Decimal`         | Yes      | The latitude value.                                                                                                                                                                                                       |
| name          | `SingleLine.Text` | No       | The location name.                                                                                                                                                                                                        |
| address       | `SingleLine.Text` | No       | The location address.                                                                                                                                                                                                     |
| icon_url      | `SingleLine.Text` | No       | Url for an image to use to represent the location on the map.                                                                                                                                                             |
| icon_width    | `Whole.None`      | No       | Width of the icon in pixels.                                                                                                                                                                                              |
| icon_height   | `Whole.None`      | No       | Height of the icon in pixels.                                                                                                                                                                                             |
| icon_anchor   | `SingeLine.Text`  | No       | A string indicating the part of the icon that should be positioned closest to the coordinate. Options are 'center' , 'top' , 'bottom' , 'left' , 'right' , 'top-left' , 'top-right' , 'bottom-left' , and 'bottom-right'. |
| icon\_offset\_x | `Whole.None`      | No       | The horizontal offset in pixels to apply relative to the icon's center. A negative value indicates left.                                                                                                                  |
| icon\_offset\_y | `Whole.None`      | No       | The vertical offset in pixels to apply relative to the icon's center. A negative value indicates up.                                                                                                                      |

## Component Events

The navigation component uses the `window.postMessage()` method to communicate state changes. To listen for events dispatched by the component add an event listener to the `window` for the "message" event e.g.

```
window.addEventListener(
  "message",
  (event) => {
	 const {data} = event;
	 ...
  },
  false,
);
```

The `data` property of the event contains the message data sent by the component. The message data has a `type` property which identifies the message as having been by the navigation component and the particular state change that has occurred.

The possible messages sent by the component are:

### TomTomNavigation.route_calculated

Fired when a route has been calculated for the provided waypoints.

#### Message Properties

| Name                            | Value                               | Description                                 |
| ------------------------------- | ----------------------------------- | ------------------------------------------- |
| `type`                          | "TomTomNavigation.route_calculated" | The message type.                           |
| `summary`                       | `Object`                            | Route summary data.                         |
| `summary.lengthInMeters`        | `number`                            | The route length in meters.                 |
| `summary.travelTimeInSeconds`   | `number`                            | The route travel time in seconds.           |
| `summary.trafficDelayInSeconds` | `number`                            | The traffic delay in seconds.               |
| `summary.departureTime`         | `number`                            | The estimated departure time for the route. |
| `summary.arrivalTime`           | `number`                            | The estimated arrival time for the route.   |

### TomTomNavigation.navigation_started

Fired when navigation is started.

| Name   | Value                                 | Description       |
| ------ | ------------------------------------- | ----------------- |
| `type` | "TomTomNavigation.navigation_started" | The message type. |

### TomTomNavigation.navigation_stopped

Fired when navigation is stopped.

| Name   | Value                                 | Description       |
| ------ | ------------------------------------- | ----------------- |
| `type` | "TomTomNavigation.navigation_stopped" | The message type. |

### TomTomNavigation.progress_update

Fired each time a location update occurs during navigation.

| Name                   | Value                              | Description                   |
| ---------------------- | ---------------------------------- | ----------------------------- |
| `type`                 | "TomTomNavigation.progress_update" | The message type.             |
| `progress`             | `Object`                           | Progress data.                |
| `progress.coordinates` | [`longitude`,`latitude`]           | Current location coordinates. |
| `progress.bearing`     | `number`                           | Current location bearing.     |
| `progress.elapsedTime` | `number`                           | The elapsed time in secconds. |

### TomTomNavigation.destination_reached

Fired when the destination is reached.

| Name                      | Value                                  | Description                                                         |
| ------------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| `type`                    | "TomTomNavigation.destination_reached" | The message type.                                                   |
| `id`                      | `string`                               | Internal ID for the record.                                         |
| `destination`             | `Object`                               | Route destination record.                                           |
| `destination.coordinates` | `Array`                                | The destination coordinates in the format [`longitude`, `latitude`] |
| `destination.name`        | `string`                               | The destination name (if provided).                                 |
| `destination.address`     | `string`                               | The destination address (if provided).                              |
| `destination.icon`        | `Object`                               | Properties specifying the icon for the record (if provided).        |

## Testing

Route test data can be found in the [data](data) directory.
