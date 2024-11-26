# TomTom Navigation Component for the Web

A Javascript navigation component implemented with React and Fluent UI.

## Development

1. Install [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable) if needed.
2. From the project root directory run `yarn` to install project dependencies.

## Component Properties

Available component properties:

| Name                              | Type                                                                                                     | Default value                                                         | Description                                                                                                                                                                                                                                             |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| style                             | `Object`                                                                                                 | `{}`                                                                  | A JavaScript object with CSS properties to style the component.                                                                                                                                                                                         |
| width                             | `number`                                                                                                 | 100                                                                   | The component width in pixels.                                                                                                                                                                                                                          |
| height                            | `number`                                                                                                 | 100                                                                   | The component height in pixels.                                                                                                                                                                                                                         |
| apiKey                            | `string`                                                                                                 |                                                                       | The TomTom API key.                                                                                                                                                                                                                                     |
| language                          | `string`                                                                                                 | `navigator.language`                                                  | Language used for the component UI controls, map and guidance instructions. An [IETF language code tag](https://datahub.io/core/language-codes). Only "en-" and "nl-" variants are currently supported.                                                 |
| measurementSystem                 | `string` possible values are "metric", "imperial" and "auto"                                             | "auto"                                                                | The measurement system. If "auto" is selected the measurement system will be based on the route location.                                                                                                                                               |
| theme                             | `string`possible values are "light", "dark" and "auto"                                                   | "auto"                                                                | The componnent theme. Influences both the map style and the theme used for the components overlaid on the map. If "auto" is selected will use the `prefers-color-scheme` media feature to detect if the user has requested light or dark color schemes. |
| initialCenter                     | `string`                                                                                                 |                                                                       | Initial map center specifed in the format "longitude,latitude". This is set once when the component is mounted.                                                                                                                                         |
| initialZoom                       | `number`                                                                                                 | 12                                                                    | Initial zoom level. This is set once when the component is mounted.                                                                                                                                                                                     |
| mapOptions                        | `Object`                                                                                                 | `{}`                                                                  | Options controlling what content and controls are displayed on the map interface.                                                                                                                                                                       |
| mapOptions.alwaysUseDrivingStyle  | `boolean`                                                                                                | `false`                                                               | If `true` always use the driving map style.                                                                                                                                                                                                             |
| mapOptions.showTrafficFlow        | `boolean`                                                                                                | `false`                                                               | Show the traffic flow layer.                                                                                                                                                                                                                            |
| mapOptions.showTrafficIncidents   | `boolean`                                                                                                | `false`                                                               | Show the traffic incidents layer.                                                                                                                                                                                                                       |
| mapOptions.showPoi                | `boolean`                                                                                                | `false`                                                               | Show the POI layer.                                                                                                                                                                                                                                     |
| mapOptions.showBuildings3D        | `boolean`                                                                                                | `true`                                                                | Show the 3D buildings layer.                                                                                                                                                                                                                            |
| mapOptions.showLocationMarker     | `boolean`                                                                                                | `true`                                                                | Show a location marker for the user's current location.                                                                                                                                                                                                 |
| mapOptions.showZoomControl        | `boolean`                                                                                                | `false`                                                               | Show the zoom control. This control, when enabled is not shown if the device is a phone due to space limitations.                                                                                                                                       |
| mapOptions.showMapSwitcherControl | `boolean`                                                                                                | `true`                                                                | Show the map style switcher control.                                                                                                                                                                                                                    |
| mapOptions.showMuteControl        | `boolean`                                                                                                | `true`                                                                | Show the mute control.                                                                                                                                                                                                                                  |
| mapOptions.showSkipControl        | `boolean`                                                                                                | `false`                                                               | Show a control for skipping to the route destination.                                                                                                                                                                                                   |
| mapOptions.showExitControl        | `boolean`                                                                                                | `false`                                                               | Show a control for exiting the component.                                                                                                                                                                                                               |
| mapOptions.showManeuverArrows     | `boolean`                                                                                                | `true`                                                                | Shows maneuver arrows along the route.                                                                                                                                                                                                                  |
| mapOptions.fitRoute               | `boolean`                                                                                                | `true`                                                                | If `true` the map bounds will be fit to the route bounds, or route waypoint bounds if the `automaticRouteCalcuation` property is `false`.                                                                                                               |
| showETAPanel                      | `boolean`                                                                                                | `true`                                                                | Show the ETA panel.                                                                                                                                                                                                                                     |
| showGuidancePanel                 | `boolean`                                                                                                | `true`                                                                | Show the navigation guidance panel.                                                                                                                                                                                                                     |
| showArrivalPanel                  | `boolean`                                                                                                | `true`                                                                | Show the navigation arrival panel.                                                                                                                                                                                                                      |
| showSearch                        | `boolean`                                                                                                | `false`                                                               | If `true` shows a search panel. This panel is currently non-functional.                                                                                                                                                                                 |
| searchPosition                    | `string` possible values are "top" and "bottom"                                                          | "bottom" if the device is a phone, "top" if it's a tablet or desktop. | Where to position the search panel.                                                                                                                                                                                                                     |
| showContinueButton                | `boolean`                                                                                                | `true`                                                                | Show the navigation continue button.                                                                                                                                                                                                                    |
| safeAreaInsets                    | `Object`                                                                                                 | `{top: 0, right: 0, bottom: 0, left: 0}`                              | The safe area reflects the area not covered by a mobile device's notch or navigation status or toolbars. The insets in this property are applied when positioning component elements such as the NextInstructionPanel.                                  |
| travelMode                        | `string` possible values are "car", "truck", "taxi", "bus", "van", "motorcycle", "bicycle", "pedestrian" | "car"                                                                 | The travel mode used for the route calculation.                                                                                                                                                                                                         |
| traffic                           | `boolean`                                                                                                | `true`                                                                | Calculates the route using live traffic.                                                                                                                                                                                                                |
| arrivalSidePreference             | `string` possible values are "anySide", "curbSide"                                                       | "anySide"                                                             | Specifies the preference of roadside on arrival to waypoints and destination. Stop on the road has to be set at least two meters to the preferred side, otherwise the behavior will default to "anySide".                                               |
| guidanceVoice                     | `string`                                                                                                 | The default guidance voice for the chosen language.                   | The name of a text-to-speech voice provided by the Microsoft Speech Service. Available voices can be found [here](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts#standard-voices).                        |
| guidanceVoiceVolume               | `number`                                                                                                 | 1.0                                                                   | The guidance voice volume. Must be a number between 0.0 (silent) and 1.0 (highest).                                                                                                                                                                     |
| guidanceVoicePlaybackRate         | `number`                                                                                                 | 1.0                                                                   | The guidance voice playback rate. 1 indicates normal speed, 2 twice as fast, 0.5 half as fast etc.                                                                                                                                                      |
| simulationSpeed                   | `string` possible values are "1x", "1.5x", "2x", "3x", "4x", "5x"                                        | "3x"                                                                  | The navigation simulation speed.                                                                                                                                                                                                                        |
| keepScreenOn                      | `boolean`                                                                                                | `true`                                                                | Prevents the device from falling asleep.                                                                                                                                                                                                                |
| automaticRouteCalculation         | `boolean`                                                                                                | `false`                                                               | Automatically calculates a route when more than 1 waypoint is provided.                                                                                                                                                                                 |
| routeUrl                          | `string`                                                                                                 |                                                                       | URL to a precalculated route result. This is expected to be a GeoJSON representation of a result from the TomTom Maps Routing API calculateRoute endpoint.                                                                                             |
| renderLayers                      | `Function`                                                                                               |                                                                       | A render prop that can be used to render custom map layers e.g. `renderLayers={(map) => (<CustomLayer map={map} />)}`                                                                                                                                   |
| routeWaypoints                    | `[Waypoint]`                                                                                             |                                                                       | An array of records for the route's waypoints. See description of the `Waypoint` record below.                                                                                                                                                          |
| onRouteUpdated                    | `function`                                                                                               |                                                                       | Fired when the route has been updated for the provided waypoints. Also fired when a precalculated route has been fetched.                                                                                                                               |
| onNavigationStarted               | `function`                                                                                               |                                                                       | Fired when navigation is started.                                                                                                                                                                                                                       |
| onNavigationStopped               | `function`                                                                                               |                                                                       | Fired when navigation is stopped.                                                                                                                                                                                                                       |
| onProgressUpdate                  | `function`                                                                                               |                                                                       | Fired each time a location update occurs during navigation.                                                                                                                                                                                             |
| onDestinationReached              | `function`                                                                                               |                                                                       | Fired when the destination is reached.                                                                                                                                                                                                                  |
| onContinue                        | `function`                                                                                               |                                                                       | Fired when the arrival panel's continue button is clicked.                                                                                                                                                                                              |

## Route Waypoint

Route waypoint records must have `longitude` and `latitude` properties, other properties are optional.

| Name        | Type              | Required | Description                                                                                                                                                                                                                                                                  |
| ----------- | ----------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| coordinates | `[number,number]` | Yes      | The waypoint coordinates specified as `[longitude,latitude]`.                                                                                                                                                                                                                |
| name        | `string`          | No       | The location name.                                                                                                                                                                                                                                                           |
| address     | `string`          | No       | The location address.                                                                                                                                                                                                                                                        |
| icon        | `Object`          | No       | Object providing icon properties                                                                                                                                                                                                                                             |
| icon.url    | `string`          | No       | URL for an image to use to represent the location on the map.                                                                                                                                                                                                                |
| icon.width  | `number`          | No       | Width of the icon in pixels.                                                                                                                                                                                                                                                 |
| icon.height | `number`          | No       | Height of the icon in pixels.                                                                                                                                                                                                                                                |
| icon.anchor | `string`          | No       | A string indicating the part of the icon that should be positioned closest to the coordinate. Options are 'center' , 'top' , 'bottom' , 'left' , 'right' , 'top-left' , 'top-right' , 'bottom-left' , and 'bottom-right'.                                                    |
| icon.offset | `[number,number]` | No       | An array where the first element is the horizontal offset in pixels to apply relative to the icon's center (a negative value indicates left) and the second element is the vertical offset in pixels to apply relative to the icon's center (a negative value indicates up). |

## Component Events

The navigation component uses 2 mechanisms for communicating state changes, callbacks and events fired using window.postMessage().

#### onRouteUpdated

Fired when the route has been updated for the provided waypoints. Also fired when a precalculated route has been fetched. The route GeoJSON is passed to the callback.

##### Message Properties

| Name                            | Value    | Description                                 |
| ------------------------------- | -------- | ------------------------------------------- |
| `route`                       | `Object` | Route GeoJSON data.                         |

#### onNavigationStarted

Fired when navigation is started.

#### onNavigationStopped

Fired when navigation is stopped.

| Name   | Value                                  | Description       |
| ------ | -------------------------------------- | ----------------- |
| `type` | "TomTomNavigation.OnNavigationStopped" | The message type. |

#### onProgressUpdate

Fired each time a location update occurs during navigation.

| Name                   | Value                    | Description                   |
| ---------------------- | ------------------------ | ----------------------------- |
| `progress`             | `Object`                 | Progress data.                |
| `progress.coordinates` | [`longitude`,`latitude`] | Current location coordinates. |
| `progress.bearing`     | `number`                 | Current location bearing.     |
| `progress.elapsedTime` | `number`                 | The elapsed time in secconds. |

#### onDestinationReached

Fired when the destination is reached.

| Name                      | Value    | Description                                                         |
| ------------------------- | -------- | ------------------------------------------------------------------- |
| `manuever`                | `string` | The maneuver code for the last maneuver taken.
|                      
| `destination`             | `Object` | Route destination record.                                           |
| `destination.coordinates` | `Array`  | The destination coordinates in the format [`longitude`, `latitude`] |
| `destination.name`        | `string` | The destination name (if provided).                                 |
| `destination.address`     | `string` | The destination address (if provided).                              |
| `destination.icon`        | `Object` | Properties specifying the icon for the record (if provided).        |

#### onContinue

Fired when the arrival panel's continue button is clicked.

### Event handling using window.postMessage()

To listen for events dispatched by the component using `window.postMessage()` add an event listener to the `window` for the "message" event e.g.

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

## Testing

Route test data can be found in the [data](data) directory.
