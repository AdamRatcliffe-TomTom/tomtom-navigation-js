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
| language                  | `SingleLine.Text`                                                                                      | `navigator.language` | Language used for the map and guidance instructions. 	An [IETF language code tag](https://datahub.io/core/language-codes). When the language provided is one of "en", "de" or "nl" it will also apply to the component UI controls.                                                                                           |
| measurementSystem         | `Enum` possible values are "metric", "imperial" and "auto"                                             | "auto"               | The measurement system. If "auto" is selected the measurement system will be based on the route location.                                                                                                                                               |
| theme                     | `Enum`possible values are "light", "dark" and "auto"                                                   | "auto"               | The componnent theme. Influences both the map style and the theme used for the components overlaid on the map. If "auto" is selected will use the `prefers-color-scheme` media feature to detect if the user has requested light or dark color schemes. |
| showTrafficFlow           | `TwoOptions`                                                                                           | false                | Show the traffic flow layer.                                                                                                                                                                                                                            |
| showTrafficIncidents      | `TwoOptions`                                                                                           | false                | Show the traffic incidents layer.                                                                                                                                                                                                                       |
| showPoi      | `TwoOptions`                                                                                           | false                | Show the POI layer.                                                                                                                                                                                                                       |
| initialCenter             | `SingleLine.Text`                                                                                      |                      | Initial map center specifed in the format "latitude,longitude". This is set once when the component is mounted.                                                                                                                                         |
| initialZoom               | `Decimal`                                                                                              | 12                   | Initial zoom level. This is set once when the component is mounted.                                                                                                                                                                                     |
| showLocationMarker        | `TwoOptions`                                                                                           | true                 | Show a location marker for the user's current location.                                                                                                                                                                                                 |
|                           |
| showMapSwitcherControl    | `TwoOptions`                                                                                           | true                | Show the map switcher control.                                                                                                                                                                                                                          |
| showMuteControl    | `TwoOptions`                                                                                           | true                | Show the mute control.                                                                                                                                                                                                                          |
| showNavigationPanel       | `TwoOptions`                                                                                           | true                 | Show the navigation panel.                                                                                                                                                                                                                              |
| automaticRouteCalculation | `TwoOptions`                                                                                           | false                | Automatically calculates a route when more than 1 waypoint is provided.                                                                                                                                                                                 |
| routeWaypoints            | `DataSet`                                                                                      |                      | References a `DataSet` containing records for each of the route's waypoints. See description of the `Waypoint` record below.                                                                                           |
| travelMode                | `Enum` possible values are "car", "truck", "taxi", "bus", "van", "motorcycle", "bicycle", "pedestrian" | "car"                | The travel mode used for the route calculation.                                                                                                                                                                                                         |
| traffic                   | `TwoOptions`                                                                                           | true                 | Calculates the route using live traffic.                                                                                                                                                                                                                |
| arrivalSidePreference     | `Enum` possible values are "anySide", "curbSide"                                                       | "anySide"            | Specifies the preference of roadside on arrival to waypoints and destination. Stop on the road has to be set at least two meters to the preferred side, otherwise the behavior will default to "anySide".                                               |
| guidanceVoice                    | `SingleLine.Text`                                                                                      |                      | The name of a text-to-speech voice provided by the Microsoft Speech Service. Available voices can be found [here](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts#standard-voices).                                                                                                                                                                                                                                     |
| simulationSpeed           | `Enum` possible values are "1x", "2x", "3x", "4x", "5x"                                                | "3x"                 | The navigation simulation speed.                                                                                                                                                                                                                        |

## Route Waypoints

The navigation component sources the route waypoints from a `DataSet`. A record must have `lng` and `lat` properties, other properties are optional.

| Name       | Type     | Required | Description |
|------------|----------|----------|-------------|
| lat           | `Decimal`         | Yes         | The latitude value.            |
| lng           | `Decimal`         | Yes         | The longitude value.            |
| name           | `SingleLine.Text`         | No         | The location name.            |
| address           | `SingleLine.Text`         | No         | The location address.            |
| iconUrl       | `SingleLine.Text`          | No         | Url for an image to use to represent the location on the map. |
| iconWidth     | `Whole.None`               | No         | Width of the icon in pixels. |
| iconHeight    | `Whole.None`               | No         | Height of the icon in pixels. |      
| iconAnchor    | `SingeLine.Text`           | No         | A string indicating the part of the icon that should be positioned closest to the coordinate. Options are  'center' ,  'top' , 'bottom' ,  'left' ,  'right' ,  'top-left' ,  'top-right' ,  'bottom-left' , and  'bottom-right'. |
| iconOffsetX   | `Whole.None`               | No         | The horizontal offset in pixels to apply relative to the icon's center. A negative value indicates left. |
| iconOffsetY   | `Whole.None`               | No         | The vertical offset in pixels to apply relative to the icon's center. A negative value indicates up.|




