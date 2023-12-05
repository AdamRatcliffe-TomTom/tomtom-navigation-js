# TomTom Navigation Component for Power Apps

A navigation PCF component implemented with React and Fluent UI.

## Development

1. Install [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable) if needed.
2. From the project root directory run `yarn` to install project dependencies.
3. Run `yarn start:watch` to run component in a local sandbox.

## Component Properties

Available component properties:

| Name                      | Type                                                                                                   | Default value        | Description                                                                                                                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| apiKey                    | `SingleLine.Text`                                                                                      |                      | The TomTom API key.                                                                                                                                                                                                                                     |
| language                  | `SingleLine.Text`                                                                                      | `navigator.language` | Language used for the map and guidance instructions. An [IETF language code tag](https://datahub.io/core/language-codes). When the language provided is one of "en" or "nl" it will also apply to the component UI controls.                      |
| measurementSystem         | `Enum` possible values are "metric", "imperial" and "auto"                                             | "auto"               | The measurement system. If "auto" is selected the measurement system will be based on the route location.                                                                                                                                               |
| theme                     | `Enum`possible values are "light", "dark" and "auto"                                                   | "auto"               | The componnent theme. Influences both the map style and the theme used for the components overlaid on the map. If "auto" is selected will use the `prefers-color-scheme` media feature to detect if the user has requested light or dark color schemes. |
| showTrafficFlow           | `TwoOptions`                                                                                           | false                | Show the traffic flow layer.                                                                                                                                                                                                                            |
| showTrafficIncidents      | `TwoOptions`                                                                                           | false                | Show the traffic incidents layer.                                                                                                                                                                                                                       |
| showPoi                   | `TwoOptions`                                                                                           | false                | Show the POI layer.                                                                                                                                                                                                                                     |
| initialCenter             | `SingleLine.Text`                                                                                      |                      | Initial map center specifed in the format "longitude,latitude". This is set once when the component is mounted.                                                                                                                                         |
| initialZoom               | `Decimal`                                                                                              | 12                   | Initial zoom level. This is set once when the component is mounted.                                                                                                                                                                                     |
| showLocationMarker        | `TwoOptions`                                                                                           | true                 | Show a location marker for the user's current location.                                                                                                                                                                                                 |
|                           |
| showMapSwitcherControl    | `TwoOptions`                                                                                           | true                 | Show the map switcher control.                                                                                                                                                                                                                          |
| showMuteControl           | `TwoOptions`                                                                                           | true                 | Show the mute control.                                                                                                                                                                                                                                  |
| showBottomPanel           | `TwoOptions`                                                                                           | true                 | Show the bottom panel.                                                                                                                                                                                                                                  |
| showGuidancePanel           | `TwoOptions`                                                                                           | true                 | Show the navigation guidance panel.                                                                                                                                                                                                                                  |
| automaticRouteCalculation | `TwoOptions`                                                                                           | false                | Automatically calculates a route when more than 1 waypoint is provided.                                                                                                                                                                                 |
| routeWaypoints            | `DataSet`                                                                                              |                      | References a `DataSet` containing records for each of the route's waypoints. See description of the `Waypoint` record below.                                                                                                                            |
| travelMode                | `Enum` possible values are "car", "truck", "taxi", "bus", "van", "motorcycle", "bicycle", "pedestrian" | "car"                | The travel mode used for the route calculation.                                                                                                                                                                                                         |
| traffic                   | `TwoOptions`                                                                                           | true                 | Calculates the route using live traffic.                                                                                                                                                                                                                |
| arrivalSidePreference     | `Enum` possible values are "anySide", "curbSide"                                                       | "anySide"            | Specifies the preference of roadside on arrival to waypoints and destination. Stop on the road has to be set at least two meters to the preferred side, otherwise the behavior will default to "anySide".                                               |
| guidanceVoice             | `SingleLine.Text`                                                                                      |                      | The name of a text-to-speech voice provided by the Microsoft Speech Service. Available voices can be found [here](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts#standard-voices).                        |
| simulationSpeed           | `Enum` possible values are "1x", "2x", "3x", "4x", "5x"                                                | "3x"                 | The navigation simulation speed.                                                                                                                                                                                                                        |

## Route Waypoints

The navigation component sources the route waypoints from a `DataSet`. The dataset must have `lng` and `lat` columns, other columns are optional.

| Name          | Type              | Required | Description                                                                                                                                                                                                               |
| ------------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| longitude     | `Decimal`         | Yes      | The longitude value.                                                                                                                                                                                                      |
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

````
window.addEventListener(
  "message",
  (event) => {
	 const {data} = event;
	 ...
  },
  false,
);
````

The `data` property of the event contains the message data sent by the component. The message data has a `type` property which identifies the message as having been by the navigation component and the particular state change that has occurred.

The possible messages sent by the component are:

### TomTomNavigation.route_calculated

Fired when a route has been calculated for the provided waypoints.

#### Message Properties

| Name    | Value                               | Description          |
| ------- | ----------------------------------- | -------------------- |
| `type`  | "TomTomNavigation.route_calculated" | The message type.    |
| `summary` | `Object`                          | Route summary data.  |
| `summary.lengthInMeters` | `number`                   | The route length in meters. |
| `summary.travelTimeInSeconds` | `number`              | The route travel time in seconds. |
| `summary.trafficDelayInSeconds` | `number`            | The traffic delay in seconds. |
| `summary.departureTime` | `number` | The estimated departure time for the route. |
| `summary.arrivalTime` | `number` | The estimated arrival time for the route. |

### TomTomNavigation.navigation_started

Fired when navigation is started.

| Name    | Value                               | Description          |
| ------- | ----------------------------------- | -------------------- |
| `type`  | "TomTomNavigation.navigation_started" | The message type.    |

### TomTomNavigation.navigation_stopped

Fired when navigation is stopped.

| Name    | Value                               | Description          |
| ------- | ----------------------------------- | -------------------- |
| `type`  | "TomTomNavigation.navigation_stopped" | The message type.    |


### TomTomNavigation.progress_update

Fired each time a location update occurs during navigation.

| Name    | Value                               | Description          |
| ------- | ----------------------------------- | -------------------- |
| `type`  | "TomTomNavigation.progress_update" | The message type.    |
| `progress` | `Object`                        | Progress data. |
| `progress.coordinates` | [`longitude`,`latitude`] | Current location coordinates. |
| `progress.bearing` | `number` | Current location bearing. |
| `progress.elapsedTime` | `number` | The elapsed time in secconds. |

### TomTomNavigation.destination_reached

Fired when the destination is reached.

| Name    | Value                               | Description          |
| ------- | ----------------------------------- | -------------------- |
| `type`  | "TomTomNavigation.destination_reached" | The message type.    |
| `id`    | `string`                               | Internal ID for the record. |
| `destination` | `Object` | Route destination record. |
| `destination.coordinates` | `Array` | The destination coordinates in the format [`longitude`, `latitude`] |
| `destination.name` | `string` | The destination name (if provided). |
| `destination.address` | `string` | The destination address (if provided). |
| `destination.icon` | `Object` | Properties specifying the icon for the record (if provided). |

## Testing

Route test data can be found in the [data](data) directory.
