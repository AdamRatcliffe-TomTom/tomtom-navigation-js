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
| mapStyles                        | `Object`                                                                                                 | `{}`                                                                  | Map style overrides, allowing custom styles to be provided for the street and driving styles.                                                                                                                                                                       |
| mapStyles.street                        | `Object`                                                                                                 | `{}`                                                                  | Specify custom styles, light and dark, to use for the street styles.                                                                                                                                                                        |
| mapStyles.street.light                        | `string` \| `Object`                                                                                                 |                                                                   | The light street style.                                                                                                                                                                        |
| mapStyles.street.dark                        | `string` \| `Object`                                                                                                 |                                                                   | The dark street style.                                                                                                                                                                        |
| mapStyles.driving                        | `Object`                                                                                                 | `{}`                                                                  | Specify custom styles, light and dark, to use for the driving styles.                                                                                                                                                                        |
| mapStyles.driving.light                        | `string` \| `Object`                                                                                                 |                                                                   | The light driving style.                                                                                                                                                                        |
| mapStyles.driving.dark                        | `string` \| `Object`                                                                                                 |                                                                   | The dark driving style.                                                                                                                                                                        |
| mapOptions                        | `Object`                                                                                                 | `{}`                                                                  | Options controlling what content and controls are displayed on the map interface.                                                                                                                                                                       |
| mapOptions.alwaysUseDrivingStyle  | `boolean`                                                                                                | `false`                                                               | If `true` always use the driving map style.                                                                                                                                                                                                             |
| mapOptions.showWatermark  | `boolean`                                                                                                | `true`                                                               | If `true` show the TomTom logo on the map.                                                                                                                                                                                                             |
| mapOptions.showTrafficFlow        | `boolean`                                                                                                | `false`                                                               | Show the traffic flow layer.                                                                                                                                                                                                                            |
| mapOptions.showTrafficIncidents   | `boolean`                                                                                                | `false`                                                               | Show the traffic incidents layer.                                                                                                                                                                                                                       |
| mapOptions.showPoi                | `boolean`                                                                                                | `false`                                                               | Show the POI layer.                                                                                                                                                                                                                                     |
| mapOptions.showBuildings3D        | `boolean`                                                                                                | `true`                                                                | Show the 3D buildings layer.                                                                                                                                                                                                                            |
| mapOptions.showLocationMarker     | `boolean`                                                                                                | `true`                                                                | Show a location marker for the user's current location.                                                                                                                                                                                                 |
| mapOptions.showZoomControl        | `boolean`                                                                                                | `false`                                                               | Show the zoom control. This control, when enabled is not shown if the device is a phone due to space limitations.                                                                                                                                       |
| mapOptions.showCompassControl        | `boolean`                                                                                                | `true`                                                               | Show the compass control.                                                                  |
| mapOptions.showMapSwitcherControl | `boolean`                                                                                                | `true`                                                                | Show the map style switcher control.                                                                                                                                                                                                                    |
| mapOptions.showMuteControl        | `boolean`                                                                                                | `true`                                                                | Show the mute control.                                                                                                                                                                                                                                  |
| mapOptions.showSkipControl        | `boolean`                                                                                                | `false`                                                               | Show a control for skipping to the route destination.                                                                                                                                                                                                   |
| mapOptions.showExitControl        | `boolean`                                                                                                | `false`                                                               | Show a control for exiting the component.                                                                                                                                                                                                               |
| mapOptions.showManeuverArrows     | `boolean`                                                                                                | `true`                                                                | Shows maneuver arrows along the route.                                                                                                                                                                                                                  |
| mapOptions.showWalkingLeg     | `boolean`                                                                                                | `true`                                                                | If `true`, and the destination point is off the road network, will draw a dotted line from the last point of the route path to the destination point.                                                                                                                                                                                                                  |
| mapOptions.fitRoute               | `boolean`                                                                                                | `true`                                                                | If `true` the map bounds will be fit to the route bounds, or route waypoint bounds if the `automaticRouteCalcuation` property is `false`.                                                                                                               |
| mapOptions.animateFitRoute               | `boolean`                                                                                                | `true`                                                                | If `true` and the fitRoute property is `true`, the camera will animate the transition to the new map bounds.                                                                                                               |
| mapOptions.mapConfig               | `Object`                                                                                                | `{}`                                                                | Options to pass to the underlying [tt.Map](https://developer.tomtom.com/maps-sdk-web-js/documentation#Maps.Map) constructor. Caution is recommended when setting map options at this level as they may be overriden or affect the behavior of other component props.                                                                                                              |
| routeOptions                        | `Object` | `{}`                                                                 | Options affecting route calculation.                                                                                                                                                                                                        |
| routeOptions.travelMode                        | `string` possible values are "car" | "car"                                                                 | The travel mode used for the route calculation.                                                                                                                                                                                                         |
| routeOptions.traffic                           | `string` possible values are "live" and "historical"                                                                                               | `live`                                                                | Decides how traffic is considered for computing routes.                                                                                                                                                                                                                |
| routeOptions.arrivalSidePreference             | `string` possible values are "anySide", "curbSide"                                                       | "anySide"                                                             | Specifies the preference of roadside on arrival to waypoints and destination. Stop on the road has to be set at least two meters to the preferred side, otherwise the behavior will default to "anySide". |
| automaticRouteCalculation         | `boolean`                                                                                                | `false`                                                               | Automatically calculates a route when more than 1 waypoint is provided.                                                                                                                                                                                 |
| arriveNorth         | `boolean`                                                                                                | `true`                                                               | When `true`, the map's bearing will be set to North when zooming out on the destination.                                                                                                                                                                                 |
| routeWaypoints                    | GeoJSON FeatureCollection<Point> \| GeoJSON Point[]                                                                                             |                                                                       | A GeoJSON FeatureCollection of Point features or an array of Point features representing the route's waypoints. See description of properties supported for a Waypoint below. When `automaticRouteCalculation` is `true`, these waypoints will be used in the route calculation.                                                                                                                                                         |
| routeData                         | `string` \| `object`                                                                                   |                                                                       | URL to a precalculated route result or the route result data. This is expected to be a GeoJSON representation of a result from the TomTom Maps Routing API calculateRoute endpoint.                                                                     |
| showGuidancePanel                 | `boolean`                                                                                                | `true`                                                                | Show the navigation guidance panel.                                                                                                                                                                                                                     |   
| showETAPanel                      | `boolean`                                                                                                | `true`                                                                | Show the ETA panel.                                                                                                                                                                                                                                     |
| showArrivalPanel                  | `boolean`                                                                                                | `true`                                                                | Show the navigation arrival panel.                                                                                                                                                                                                                      |
| showSearch                        | `boolean`                                                                                                | `false`                                                               | If `true` shows a search panel. This panel is currently non-functional.                                                                                                                                                                                 |
| searchPosition                    | `string` possible values are "top" and "bottom"                                                          | "bottom" if the device is a phone, "top" if it's a tablet or desktop. | Where to position the search panel.                                                                                                                                                                                                                     |
| showContinueButton                | `boolean`                                                                                                | `true`                                                                | Show the navigation continue button.                                                                                                                                                                                                                    |
| continueButtonText                | `string`                                                                                                | "Continue walking"                                                                | Text to use for the continue button (if visible).                                                                                                                                                                                                                    |
| safeAreaInsets                    | `Object`                                                                                                 | `{top: 0, right: 0, bottom: 0, left: 0}`                              | The safe area reflects the area not covered by a mobile device's notch or navigation status or toolbars. The insets in this property are applied when positioning component elements such as the NextInstructionPanel.                                  |                                            |
| guidanceVoice                     | `string`                                                                                                 | The default guidance voice for the chosen language.                   | The name of a text-to-speech voice provided by the Microsoft Speech Service. Available voices can be found [here](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts#standard-voices).                        |
| guidanceVoiceVolume               | `number`                                                                                                 | 1.0                                                                   | The guidance voice volume. Must be a number between 0.0 (silent) and 1.0 (highest).                                                                                                                                                                     |
| guidanceVoicePlaybackRate         | `number`                                                                                                 | 1.0                                                                   | The guidance voice playback rate. 1 indicates normal speed, 2 twice as fast, 0.5 half as fast etc.                                                                                                                                                      |
| simulationOptions                   | `Object`     | `{}`                                                                  | Navigation simulation options.                                                                                                                                                                                                                        |
| simulationOptions.speed                   | `string` possible values are "1x", "1.5x", "2x", "3x", "4x", "5x"                                        | "1x"                                                                  | The navigation simulation speed.                                                                                                                                                                                                                        |
| simulationOptions.zoom                   | `Object`                                         |                                                                   | Simulation zoom level for vehicle and pedestrian navigation.                                                                                                                                                                                                                        |
| simulationOptions.zoom.vehicle                   | `number`                                         | 17                                                                   | Simulation zoom level for vehicle navigation.                                                                                                                                                                                                                        |
| simulationOptions.zoom.pedestrian                   | `number`                                         | 20                                                                  | Simulation zoom level for vehicle pedestrian navigation.                                                                                                                                                                                                                        |
| simulationOptions.spacing                   | `string` possible values are "constant", "acceldecel"                                         | "acceldecel"                                                                  | - If "constant" zoom when not maneuvering.<br> - If "acceldecel" zoom at 30mph.                                                                                                                                                                                                                        |
| simulationOptions.repeat                   | `boolean`                                          | `false`                                                                  | If `true` the navigation simulation will loop every 2 seconds until navigation is explicitly stopped.                                                                                                                                                                                                                        |
| keepScreenOn                      | `boolean`                                                                                                | `true`                                                                | Prevents the device from falling asleep.                                                                                                                                                                                                                |
| renderLayers                      | `Function`                                                                                               |                                                                       | A render prop that can be used to render custom map layers e.g. `renderLayers={(map) => (<CustomLayer map={map} />)}`                                                                                                                                   |
| renderETAPanel                      | `Function`                                                                                               |                                                                       | A render prop that can be used to render a custom ETA panel in place of the built-in panel e.g. <pre>renderETAPanel: ({<br>&nbsp;&nbsp;&nbsp;&nbsp;route,<br>&nbsp;&nbsp;&nbsp;&nbsp;measurementSystem,<br>&nbsp;&nbsp;&nbsp;&nbsp;isNavigating,<br>&nbsp;&nbsp;&nbsp;&nbsp;onStartNavigation,<br>&nbsp;&nbsp;&nbsp;&nbsp;onStopNavigation<br>}) => (<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;ETAPanel<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;customer=&#123;customer&#125;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;destination=&#123;destination&#125;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;progress=&#123;progress&#125;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;route=&#123;route&#125;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;measurementSystem=&#123;measurementSystem&#125;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;isNavigating=&#123;isNavigating&#125;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;onStartNavigation=&#123;onStartNavigation&#125;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;onStopNavigation=&#123;onStopNavigation&#125;<br>&nbsp;&nbsp;&nbsp;&nbsp;/&gt;)</pre> |
| renderArrivalPanel                      | `Function`                                                                                               |                                                                       | A render prop that can be used to render a custom Arrival panel in place of the built-in panel e.g. <pre>renderArrivalPanel=(&#123;<br>&nbsp;&nbsp;&nbsp;&nbsp;onStopNavigation,<br>&nbsp;&nbsp;&nbsp;&nbsp;onNavigationContinue<br>&#125;) => (<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;ArrivalPanel<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;customer=&#123;customer&#125;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;destination=&#123;destination&#125;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;destinationText=&#123;destinationText&#125;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lastManeuver=&#123;lastManeuver&#125;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;showContinueButton<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;continueButtonText=&#123;continueButtonText&#125;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;onStopNavigation=&#123;onStopNavigation&#125;<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;onNavigationContinue=&#123;onNavigationContinue&#125;<br>&nbsp;&nbsp;&nbsp;&nbsp;/&gt;)</pre> |
| onMapReady                    | `function`                                                                                               | | Fired when the map is ready.  |
| onRouteUpdated                    | `function`                                                                                               |                                                                       | Fired when the route has been updated for the provided waypoints. Also fired when a precalculated route has been fetched.                                                                                                                               |
| onNavigationStarted               | `function`                                                                                               |                                                                       | Fired when navigation is started.                                                                                                                                                                                                                       |
| onNavigationStopped               | `function`                                                                                               |                                                                       | Fired when navigation is stopped.                                                                                                                                                                                                                       |
| onProgressUpdate                  | `function`                                                                                               |                                                                       | Fired each time a location update occurs during navigation.                                                                                                                                                                                             |
| onDestinationReached              | `function`                                                                                               |                                                                       | Fired when the destination is reached.                                                                                                                                                                                                                  |
| onContinue                        | `function`                                                                                               |                                                                       | Fired when the arrival panel's continue button is clicked.                                                                                                                                                                                              |

## Waypoint

A waypoint is a GeoJSON Point feature used to represent a location along a route. It must follow the GeoJSON Feature structure, with a geometry of type "Point" and an optional properties object.

### Waypoint Format

Each waypoint must be a GeoJSON Feature with the following structure:

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  },
  "properties": {
    "name": "Optional name of the waypoint",
    "address": "Optional address of the waypoint",
    "icon": {
      "url": "URL of an icon representing the waypoint",
      "width": 24,
      "height": 24,
      "anchor": "center",
      "offset": [0, -12]
    }
  }
}
```

### **Waypoint Properties**

| Name                        | Type                                                                                      | Required | Description |
|-----------------------------|-----------------------------------------------------------------------------------------|----------|-------------|
| `type`                      | `"Feature"`                                                                              | Yes    | Must be `"Feature"` as per the GeoJSON format. |
| `geometry`                  | `object`                                                                                | Yes    | Defines the point geometry. Must contain a `type` of `"Point"` and `coordinates`. |
| `geometry.type`             | `"Point"`                                                                               | Yes    | The geometry type must always be `"Point"`. |
| `geometry.coordinates`      | `[number, number]`                                                                      | Yes    | An array containing `[longitude, latitude]` in decimal degrees. |
| `properties`                | `object`                                                                                | No    | Contains optional metadata for the waypoint. |
| `properties.name`           | `string`                                                                                | No    | Optional name of the waypoint. |
| `properties.address`        | `string`                                                                                | No    | Optional address of the waypoint. |
| `properties.icon`           | `object`                                                                                | No    | Optional object containing icon properties. |
| `properties.icon.url`       | `string`                                                                                | No    | URL for an image to represent the waypoint on the map. |
| `properties.icon.width`     | `number`                                                                                | No    | Width of the icon in pixels. |
| `properties.icon.height`    | `number`                                                                                | No    | Height of the icon in pixels. |
| `properties.icon.anchor`    | `"center"` \| `"top"` \| `"bottom"` \| `"left"` \| `"right"` \| `"top-left"` \| `"top-right"` \| `"bottom-left"` \| `"bottom-right"` | No | Specifies which part of the icon aligns with the coordinate. |
| `properties.icon.offset`    | `[number, number]`                                                                      | No    | Offset `[x, y]` in pixels to adjust the icon’s position relative to the waypoint. |

## Component Events

The navigation component uses 2 mechanisms for communicating state changes, callbacks and events fired using window.postMessage().

#### onMapReady

Fired when the map is ready. The `Map` object is passed to the callback.

##### Message Properties

| Name    | Value    | Description         |
| ------- | -------- | ------------------- |
| `map` | `Object` | The Map object. |

#### onRouteUpdated

Fired when the route has been updated for the provided waypoints. Also fired when a precalculated route has been fetched. The route GeoJSON is passed to the callback.

##### Message Properties

| Name    | Value    | Description         |
| ------- | -------- | ------------------- |
| `route` | `Object` | Route GeoJSON data. |

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

| Name       | Value    | Description                                    |
| ---------- | -------- | ---------------------------------------------- |
| `manuever` | `string` | The maneuver code for the last maneuver taken. |

|  
| `destination` | `Object` | Route destination record. |
| `destination.coordinates` | `Array` | The destination coordinates in the format [`longitude`, `latitude`] |
| `destination.name` | `string` | The destination name (if provided). |
| `destination.address` | `string` | The destination address (if provided). |
| `destination.icon` | `Object` | Properties specifying the icon for the record (if provided). |

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
