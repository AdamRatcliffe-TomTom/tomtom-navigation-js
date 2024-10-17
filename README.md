# TomTom Navigation Component for Power Apps

A navigation PCF component implemented with React and Fluent UI.

> [!IMPORTANT]
> Use of this component requires turning off "Scale to fit" in your app settings.

## Development

1. Install [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable) if needed.
2. From the project root directory run `yarn` to install project dependencies.
3. Run `yarn start:watch` to run component in a local sandbox.

## Component Properties

Available component properties:

| Name                      | Type                                                                                                                   | Usage | Default value            | Description                                                                                                                                                                                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| apiKey                    | `SingleLine.Text`                                                                                                      | input |                          | The TomTom API key.                                                                                                                                                                                                                                     |
| language                  | `SingleLine.Text`                                                                                                      | input | `navigator.language`     | Language used for the component UI controls, map and guidance instructions. An [IETF language code tag](https://datahub.io/core/language-codes). Only "en-" and "nl-" variants are currently supported.                            |
| measurementSystem         | `Enum` possible values are "metric", "imperial" and "auto"                                                             | input | "auto"                   | The measurement system. If "auto" is selected the measurement system will be based on the route location.                                                                                                                                               |
| theme                     | `Enum`possible values are "light", "dark" and "auto"                                                                   | input | "auto"                   | The componnent theme. Influences both the map style and the theme used for the components overlaid on the map. If "auto" is selected will use the `prefers-color-scheme` media feature to detect if the user has requested light or dark color schemes. |
| showTrafficFlow           | `TwoOptions`                                                                                                           | input | `false`                  | Show the traffic flow layer.                                                                                                                                                                                                                            |
| showTrafficIncidents      | `TwoOptions`                                                                                                           | input | `false`                  | Show the traffic incidents layer.                                                                                                                                                                                                                       |
| showPoi                   | `TwoOptions`                                                                                                           | input | `false`                  | Show the POI layer.                                                                                                                                                                                                                                     |
| initialCenter             | `SingleLine.Text`                                                                                                      | input |                          | Initial map center specifed in the format "longitude,latitude". This is set once when the component is mounted.                                                                                                                                         |
| initialZoom               | `Decimal`                                                                                                              | input | 12                       | Initial zoom level. This is set once when the component is mounted.                                                                                                                                                                                     |
| showLocationMarker        | `TwoOptions`                                                                                                           | input | `true`                   | Show a location marker for the user's current location.                                                            |                           
| showMapSwitcherControl    | `TwoOptions`                                                                                                           | input | `true`                   | Show the map style switcher control.                                                                                                                                                                                                                          |
| showMuteControl           | `TwoOptions`                                                                                                           | input | `true`                   | Show the mute control.                                                                                                                                                                                                                                  |
| showSkipControl           | `TwoOptions`                                                                                                           | input | `false`                   | Show a control for skipping to the route destination.                                                                                                                                                                                                                                  |
| showExitControl           | `TwoOptions`                                                                                                           | input | `false`                   | Show a control for exiting the component.                                                                                                                                                                                                                                  |
| showZoomControl           | `TwoOptions`                                                                                                           | input | `false`                   | Show the zoom control. This control, when enabled is not shown if the device is a phone due to space limitations.                                                                                                                                                                                                                                  |
| showBottomPanel           | `TwoOptions`                                                                                                           | input | `true`                   | Show the bottom panel.                                                                                                                                                                                                                                  |
| showGuidancePanel         | `TwoOptions`                                                                                                           | input | `true`                   | Show the navigation guidance panel.                                                                                                                                                                                                                     |
| showManeuverArrows         | `TwoOptions`                                                                                                           | input | `true`                   | Shows maneuver arrows along the route.                                                                                                                                                                                                                     |
| automaticRouteCalculation | `TwoOptions`                                                                                                           | input | `false`                  | Automatically calculates a route when more than 1 waypoint is provided.                                                                                                                                                                                 |
| travelMode                | `Enum` possible values are "car", "truck", "taxi", "bus", "van", "motorcycle", "bicycle", "pedestrian"                 | input | "car"                    | The travel mode used for the route calculation.                                                                                                                                                                                                         |
| traffic                   | `TwoOptions`                                                                                                           | input | `true`                   | Calculates the route using live traffic.                                                                                                                                                                                                                |
| arrivalSidePreference     | `Enum` possible values are "anySide", "curbSide"                                                                       | input | "anySide"                | Specifies the preference of roadside on arrival to waypoints and destination. Stop on the road has to be set at least two meters to the preferred side, otherwise the behavior will default to "anySide".                                               |
| guidanceVoice             | `SingleLine.Text`                                                                                                      | input |                          | The name of a text-to-speech voice provided by the Microsoft Speech Service. Available voices can be found [here](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts#standard-voices).                        |
| simulationSpeed           | `Enum` possible values are "1x", "2x", "3x", "4x", "5x"                                                                | input | "3x"                     | The navigation simulation speed.                                                                                                                                                                                                                        |
| keepScreenOn                   | `TwoOptions`                                                                                                           | input | `true`                   | Prevents the device from falling asleep.                                                                                                                                                                                                                |
| routeUrl                    | `SingleLine.Text`                                                                                                      | input |                          | URL to a pre-calculated route result in JSON format.                                                                                                                                                                                                                                     |
| routeWaypoints            | `DataSet`                                                                                                              | input |                          | References a `DataSet` containing records for each of the route's waypoints. See description of the `Waypoint` record below.                                                                                                                            |
| routeWaypointsLongitude   | `SingleLine.Text`                                                                                                      | input | ""                       | Column in the bound dataset containing the longitude value.                                                                                                                                                                                             |
| routeWaypointsLatitude    | `SingleLine.Text`                                                                                                      | input | ""                       | Column in the bound dataset containing the latitude value.                                                                                                                                                                                              |
| routeWaypointsName        | `SingleLine.Text`                                                                                                      | input | ""                       | Column in the bound dataset containing the name value.                                                                                                                                                                                                  |
| routeWaypointsAddress     | `SingleLine.Text`                                                                                                      | input | ""                       | Column in the bound dataset containing the address value.                                                                                                                                                                                               |
| routeWaypointsIconUrl     | `SingleLine.Text`                                                                                                      | input | ""                       | Column in the bound dataset containing the icon_url value.                                                                                                                                                                                              |
| routeWaypointsIconWidth   | `SingleLine.Text`                                                                                                      | input | ""                       | Column in the bound dataset containing the icon_width value.                                                                                                                                                                                            |
| routeWaypointsIconHeight  | `SingleLine.Text`                                                                                                      | input | ""                       | Column in the bound dataset containing the icon_height value.                                                                                                                                                                                           |
| routeWaypointsIcon_anchor | `SingleLine.Text`                                                                                                      | input | ""                       | Column in the bound dataset containing the icon anchor value.                                                                                                                                                                                           |
| routeWaypointsIconOffsetX | `SingleLine.Text`                                                                                                      | input | ""                       | Column in the bound dataset containing the icon_offset_x value.                                                                                                                                                                                         |
| routeWaypointsIconOffsetY | `SingleLine.Text`                                                                                                      | input | ""                       | Column in the bound dataset containing the icon_offset_y value.                                                                                                                                                                                         
| name                     | `SingleLine.Text` | output | | The name of the event when the OnChange event is fired by the component. Either "OnChange" or "OnClose". |
| value                    | `SingleLine.Text` | output | | The value of the event when the OnChange event is fired by the component. |

## Route Waypoints

The navigation component sources the route waypoints from a `DataSet`. The dataset must have `longitude` and `latitude` columns, other columns are optional.

The names shown in the table are the defaults that will be expected by the component if column mappings are not specified using the mapping input properties.

| Name          | Type              | Required | Description                                                                                                                                                                                                               |
| ------------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| longitude     | `Decimal`         | Yes      | The longitude value.                                                                                                                                                                                                      |
| latitude      | `Decimal`         | Yes      | The latitude value.                                                                                                                                                                                                       |
| name          | `SingleLine.Text` | No       | The location name.                                                                                                                                                                                                        |
| address       | `SingleLine.Text` | No       | The location address.                                                                                                                                                                                                     |
| icon_url      | `SingleLine.Text` | No       | URL for an image to use to represent the location on the map.                                                                                                                                                             |
| icon_width    | `Whole.None`      | No       | Width of the icon in pixels.                                                                                                                                                                                              |
| icon_height   | `Whole.None`      | No       | Height of the icon in pixels.                                                                                                                                                                                             |
| icon_anchor   | `SingeLine.Text`  | No       | A string indicating the part of the icon that should be positioned closest to the coordinate. Options are 'center' , 'top' , 'bottom' , 'left' , 'right' , 'top-left' , 'top-right' , 'bottom-left' , and 'bottom-right'. |
| icon_offset_x | `Whole.None`      | No       | The horizontal offset in pixels to apply relative to the icon's center. A negative value indicates left.                                                                                                                  |
| icon_offset_y | `Whole.None`      | No       | The vertical offset in pixels to apply relative to the icon's center. A negative value indicates up.                                                                                                                      |

## Component Events

The navigation component uses 2 mechanisms for communicating state changes, one enabling other PCF components to subscribe to component events, and the other for the app using the component.

### Event handling using the component `OnChange` property

PCF components fire a single event, `OnChange`. To overcome this limitation, the navigation component overloads this event by providing a `name` output property to allow more event types to be fired by the component.

For more information on this pattern see [A Workable Pattern for PCF Events You Can Use Today](https://98.codes/a-workable-pattern-for-pcf-events-you-can-use-today/).

Use the PowerFx Switch function in your control's `OnChange` behavior property to handle these events in your app.

```
Switch(
  Self.name,
  "OnRouteCalculated",
    Notify("OnRouteCalculated received"),
  "OnExit",
    Notify("OnExit received!")
)
```

Events emitted by the component:

#### OnChange

Fired when a route is calculated.

##### Output properties

| Name    | Value      | Description             |
| ------- | ---------- | ----------------------- |
| `name`  | "OnRouteCalculated" | The event name |

#### OnNavigationStarted

Fired when navigation is started.

##### Output properties

| Name    | Value      | Description             |
| ------- | ---------- | ----------------------- |
| `name`  | "OnNavigationStarted" | The event name |

#### OnNavigationStopped

Fired when navigation is stopped.

##### Output properties

| Name    | Value      | Description             |
| ------- | ---------- | ----------------------- |
| `name`  | "OnNavigationStopped" | The event name |

#### OnProgressUpdate

Fired each time a location update occurs during navigation.

##### Output properties

| Name    | Value      | Description             |
| ------- | ---------- | ----------------------- |
| `name`  | "OnProgressUpdate" | The event name |
| `value` | `object` | The progress data |

#### OnDestinationReached

Fired when the destination is reached.

##### Output properties

| Name    | Value      | Description             |
| ------- | ---------- | ----------------------- |
| `name`  | "OnDestinationReached" | The event name |

#### OnExit

Fired when the component's exit button is clicked.

##### Output properties

| Name    | Value      | Description             |
| ------- | ---------- | ----------------------- |
| `name`  | "OnExit" | The event name |

### Event handling using window.postMessage()

The navigation component uses the `window.postMessage()` method to communicate state changes to other PCF components. To listen for events dispatched by the component add an event listener to the `window` for the "message" event e.g.

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

#### TomTomNavigation.OnRouteCalculated

Fired when a route has been calculated for the provided waypoints.

##### Message Properties

| Name                            | Value                               | Description                                 |
| ------------------------------- | ----------------------------------- | ------------------------------------------- |
| `type`                          | "TomTomNavigation.OnRouteCalculated" | The message type.                           |
| `summary`                       | `Object`                            | Route summary data.                         |
| `summary.lengthInMeters`        | `number`                            | The route length in meters.                 |
| `summary.travelTimeInSeconds`   | `number`                            | The route travel time in seconds.           |
| `summary.trafficDelayInSeconds` | `number`                            | The traffic delay in seconds.               |
| `summary.departureTime`         | `number`                            | The estimated departure time for the route. |
| `summary.arrivalTime`           | `number`                            | The estimated arrival time for the route.   |

#### TomTomNavigation.OnNavigationStarted

Fired when navigation is started.

| Name   | Value                                 | Description       |
| ------ | ------------------------------------- | ----------------- |
| `type` | "TomTomNavigation.OnNavigationStarted" | The message type. |

#### TomTomNavigation.OnNavigationStopped

Fired when navigation is stopped.

| Name   | Value                                 | Description       |
| ------ | ------------------------------------- | ----------------- |
| `type` | "TomTomNavigation.OnNavigationStopped" | The message type. |

#### TomTomNavigation.OnProgressUpdate

Fired each time a location update occurs during navigation.

| Name                   | Value                              | Description                   |
| ---------------------- | ---------------------------------- | ----------------------------- |
| `type`                 | "TomTomNavigation.OnProgressUpdate" | The message type.             |
| `progress`             | `Object`                           | Progress data.                |
| `progress.coordinates` | [`longitude`,`latitude`]           | Current location coordinates. |
| `progress.bearing`     | `number`                           | Current location bearing.     |
| `progress.elapsedTime` | `number`                           | The elapsed time in secconds. |

#### TomTomNavigation.OnDestinationReached

Fired when the destination is reached.

| Name                      | Value                                  | Description                                                         |
| ------------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| `type`                    | "TomTomNavigation.OnDestinationReached" | The message type.                                                   |
| `id`                      | `string`                               | Internal ID for the record.                                         |
| `destination`             | `Object`                               | Route destination record.                                           |
| `destination.coordinates` | `Array`                                | The destination coordinates in the format [`longitude`, `latitude`] |
| `destination.name`        | `string`                               | The destination name (if provided).                                 |
| `destination.address`     | `string`                               | The destination address (if provided).                              |
| `destination.icon`        | `Object`                               | Properties specifying the icon for the record (if provided).        |

## Testing

Route test data can be found in the [data](data) directory.
