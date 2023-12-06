import * as React from "react";
import _isNil from "lodash.isnil";
import _isEmpty from "lodash.isempty";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./app/store";
import App from "./app/App";
import parseCoordinateString from "./functions/parseCoordinateString";
import detectColorScheme from "./functions/detectColorScheme";
import NavigationStates from "./constants/NavigationStates";

import { MAX_WAYPOINTS } from "./config";

// eslint-disable-next-line no-undef
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;

type DataSet = ComponentFramework.PropertyTypes.DataSet;

type Icon = {
  url: string;
  width: number;
  height: number;
  anchor: string;
  offset: [number, number];
};

type Waypoint = {
  coordinates: [number, number];
  name?: string;
  address?: string;
  icon?: Icon;
};

type FieldMappings = {
  longitude: string;
  latitude: string;
  name: string;
  address: string;
  iconUrl: string;
  iconWidth: string;
  iconHeight: string;
  iconAnchor: string;
  iconOffsetX: string;
  iconOffsetY: string;
};

type NavigationState =
  | typeof NavigationStates.NAVIGATION_NOT_STARTED
  | typeof NavigationStates.NAVIGATION_STARTED
  | typeof NavigationStates.NAVIGATION_STOPPED
  | typeof NavigationStates.DESTINATION_REACHED;

export class TomTomNavigation
  implements ComponentFramework.ReactControl<IInputs, IOutputs>
{
  private notifyOutputChanged: () => void;

  private navigationState?: NavigationState;
  private componentExit?: boolean;

  /**
   * Empty constructor.
   */
  constructor() {}

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary
  ): void {
    this.notifyOutputChanged = notifyOutputChanged;
    context.mode.trackContainerResize(true);
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   * @returns ReactElement root react element for the control
   */
  public updateView(
    context: ComponentFramework.Context<IInputs>
  ): React.ReactElement {
    const apiKey = this.getRawParameter(context, "apiKey");

    let theme = this.getRawParameter(context, "theme");
    theme = theme === "auto" ? detectColorScheme() : theme;

    const language = this.getRawParameter(context, "language");
    const measurementSystem = this.getRawParameter(
      context,
      "measurementSystem"
    );
    const initialCenter = parseCoordinateString(
      this.getRawParameter(context, "initialCenter"),
      true
    );
    const initialZoom = this.getRawParameter(context, "initialZoom");
    const enableGeolocation = this.getRawParameter(
      context,
      "enableGeolocation"
    );
    const showTrafficFlow = this.getRawParameter(context, "showTrafficFlow");
    const showTrafficIncidents = this.getRawParameter(
      context,
      "showTrafficIncidents"
    );
    const showPoi = this.getRawParameter(context, "showPoi");
    const showLocationMarker = this.getRawParameter(
      context,
      "showLocationMarker"
    );
    const showMapSwitcherControl = this.getRawParameter(
      context,
      "showMapSwitcherControl"
    );
    const showMuteControl = this.getRawParameter(context, "showMuteControl");
    const showExitControl = this.getRawParameter(context, "showExitControl");
    const showBottomPanel = this.getRawParameter(context, "showBottomPanel");
    const showGuidancePanel = this.getRawParameter(
      context,
      "showGuidancePanel"
    );
    const showArrivalPanel = this.getRawParameter(context, "showArrivalPanel");
    const automaticRouteCalculation = this.getRawParameter(
      context,
      "automaticRouteCalculation"
    );
    const guidanceVoice = this.getRawParameter(context, "guidanceVoice");
    const guidanceVoiceVolume = this.getRawParameter(
      context,
      "guidanceVoiceVolume"
    );
    const simulationSpeed = this.getRawParameter(context, "simulationSpeed");
    const travelMode = this.getRawParameter(context, "travelMode");
    const traffic = this.getRawParameter(context, "traffic");
    const arrivalSidePreference = this.getRawParameter(
      context,
      "arrivalSidePreference"
    );

    const dataset = context.parameters.routeWaypoints;
    const longitudeField = this.getRawParameter(
      context,
      "routeWaypointsLongitude",
      "longitude"
    );
    const latitudeField = this.getRawParameter(
      context,
      "routeWaypointsLatitude",
      "latitude"
    );
    const nameField = this.getRawParameter(
      context,
      "routeWaypointsName",
      "name"
    );
    const addressField = this.getRawParameter(
      context,
      "routeWaypointsAddress",
      "address"
    );
    const iconUrlField = this.getRawParameter(
      context,
      "routeWaypointsIconUrl",
      "icon_url"
    );
    const iconWidthField = this.getRawParameter(
      context,
      "routeWaypointsIconWidth",
      "icon_width"
    );
    const iconHeightField = this.getRawParameter(
      context,
      "routeWaypointsIconHeight",
      "icon_height"
    );
    const iconAnchorField = this.getRawParameter(
      context,
      "routeWaypointsIconAnchor",
      "icon_anchor"
    );
    const iconOffsetXField = this.getRawParameter(
      context,
      "routeWaypointsIconOffsetX",
      "icon_offset_x"
    );
    const iconOffsetYField = this.getRawParameter(
      context,
      "routeWaypointsIconOffsetY",
      "icon_offset_y"
    );
    const fieldMappings = {
      longitude: longitudeField,
      latitude: latitudeField,
      name: nameField,
      address: addressField,
      iconUrl: iconUrlField,
      iconWidth: iconWidthField,
      iconHeight: iconHeightField,
      iconAnchor: iconAnchorField,
      iconOffsetX: iconOffsetXField,
      iconOffsetY: iconOffsetYField
    };

    const waypoints = this.getWaypointsFromDataSet(dataset, fieldMappings);
    // const waypoints = this.getTestWaypoints();

    const width = context.mode.allocatedWidth;
    const height = context.mode.allocatedHeight;

    const mapOptions = {
      enableGeolocation,
      showTrafficFlow,
      showTrafficIncidents,
      showPoi,
      showLocationMarker,
      showMapSwitcherControl,
      showMuteControl,
      showExitControl,
      onComponentExit: this.handleComponentExit
    };

    const routeOptions = {
      language,
      travelMode,
      traffic,
      arrivalSidePreference,
      locations: waypoints
    };

    // eslint-disable-next-line react/no-children-prop
    return React.createElement(StoreProvider, {
      store,
      children: [
        React.createElement(App, {
          key: "TomTomNavigation",
          apiKey,
          theme,
          language,
          measurementSystem,
          width,
          height,
          guidanceVoice,
          guidanceVoiceVolume,
          simulationSpeed,
          initialCenter,
          initialZoom,
          mapOptions,
          routeOptions,
          showBottomPanel,
          showGuidancePanel,
          showArrivalPanel,
          automaticRouteCalculation,
          onNavigationStateChange: this.handleNavigationStateChange
        })
      ]
    });
  }

  handleNavigationStateChange = (state: NavigationState) => {
    this.navigationState = state;
    this.notifyOutputChanged();
  };

  handleComponentExit = () => {
    this.componentExit = true;
    this.notifyOutputChanged();
  };

  private getTestWaypoints() {
    return [
      {
        id: "bd374fb2-817d-41f2-8550-4f82d2b77558",
        coordinates: [-122.29776350429181, 37.540487550648336],
        name: "Blue Bottle Coffee",
        address: "3081 S Delaware St, San Mateo, CA 94403",
        icon: {
          url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iODMiIHZpZXdCb3g9IjAgMCA2NCA4MyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgc3R5bGU9Im1peC1ibGVuZC1tb2RlOm11bHRpcGx5IiBvcGFjaXR5PSIwLjI5OTI0NyI+CjxlbGxpcHNlIGN4PSIzMi4wMDAyIiBjeT0iNzYuMzMzIiByeD0iMTQuNjY2NyIgcnk9IjYiIGZpbGw9InVybCgjcGFpbnQwX3JhZGlhbF8xMDBfMTI3OTEpIi8+CjwvZz4KPHJlY3QgeD0iNjQiIHk9IjEiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgcng9IjMyIiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NCAxKSIgZmlsbD0iIzJCQUVGRiIvPgo8cmVjdCB4PSI2Mi41IiB5PSIyLjUiIHdpZHRoPSI2MSIgaGVpZ2h0PSI2MSIgcng9IjMwLjUiIHRyYW5zZm9ybT0icm90YXRlKDkwIDYyLjUgMi41KSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxtYXNrIGlkPSJwYXRoLTQtaW5zaWRlLTFfMTAwXzEyNzkxIiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNTQuNjI3NCAxMC4zNzI2QzQyLjEzMDYgLTIuMTI0MTkgMjEuODY5NCAtMi4xMjQxOSA5LjM3MjU4IDEwLjM3MjZDLTMuMTI0MTkgMjIuODY5NCAtMy4xMjQxOSA0My4xMzA2IDkuMzcyNTggNTUuNjI3NEM5Ljg3NTEyIDU2LjEzIDEwLjM5MDIgNTYuNjEyMyAxMC45MTY4IDU3LjA3NDRDMTcuNzIxOCA2My4wNDU2IDI1Ljc0MTQgNjguMTU5NiAzMC4yNjggNzZDMzEuMDM3OCA3Ny4zMzMzIDMyLjk2MjMgNzcuMzMzMyAzMy43MzIxIDc2QzM4LjI1ODggNjguMTU5NiA0Ni4yNzg1IDYzLjA0NTUgNTMuMDgzMyA1Ny4wNzQyQzUzLjYwOTkgNTYuNjEyMiA1NC4xMjQ5IDU2LjEyOTkgNTQuNjI3NCA1NS42Mjc0QzY3LjEyNDIgNDMuMTMwNiA2Ny4xMjQyIDIyLjg2OTQgNTQuNjI3NCAxMC4zNzI2WiIvPgo8L21hc2s+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNTQuNjI3NCAxMC4zNzI2QzQyLjEzMDYgLTIuMTI0MTkgMjEuODY5NCAtMi4xMjQxOSA5LjM3MjU4IDEwLjM3MjZDLTMuMTI0MTkgMjIuODY5NCAtMy4xMjQxOSA0My4xMzA2IDkuMzcyNTggNTUuNjI3NEM5Ljg3NTEyIDU2LjEzIDEwLjM5MDIgNTYuNjEyMyAxMC45MTY4IDU3LjA3NDRDMTcuNzIxOCA2My4wNDU2IDI1Ljc0MTQgNjguMTU5NiAzMC4yNjggNzZDMzEuMDM3OCA3Ny4zMzMzIDMyLjk2MjMgNzcuMzMzMyAzMy43MzIxIDc2QzM4LjI1ODggNjguMTU5NiA0Ni4yNzg1IDYzLjA0NTUgNTMuMDgzMyA1Ny4wNzQyQzUzLjYwOTkgNTYuNjEyMiA1NC4xMjQ5IDU2LjEyOTkgNTQuNjI3NCA1NS42Mjc0QzY3LjEyNDIgNDMuMTMwNiA2Ny4xMjQyIDIyLjg2OTQgNTQuNjI3NCAxMC4zNzI2WiIgZmlsbD0iIzA1NUI4NyIvPgo8cGF0aCBkPSJNOS4zNzI1OCAxMC4zNzI2TDcuMjUxMjYgOC4yNTEyNkw5LjM3MjU4IDEwLjM3MjZaTTU0LjYyNzQgMTAuMzcyNkw1Ni43NDg3IDguMjUxMjZWOC4yNTEyNkw1NC42Mjc0IDEwLjM3MjZaTTkuMzcyNTggNTUuNjI3NEwxMS40OTM5IDUzLjUwNjFMOS4zNzI1OCA1NS42Mjc0Wk01NC42Mjc0IDU1LjYyNzRMNTYuNzQ4NyA1Ny43NDg3TDU0LjYyNzQgNTUuNjI3NFpNMTEuNDkzOSAxMi40OTM5QzIyLjgxOTEgMS4xNjg3IDQxLjE4MDkgMS4xNjg3IDUyLjUwNjEgMTIuNDkzOUw1Ni43NDg3IDguMjUxMjZDNDMuMDgwNCAtNS40MTcwOSAyMC45MTk2IC01LjQxNzA5IDcuMjUxMjYgOC4yNTEyNkwxMS40OTM5IDEyLjQ5MzlaTTExLjQ5MzkgNTMuNTA2MUMwLjE2ODY5OSA0Mi4xODA5IDAuMTY4Njk5IDIzLjgxOTEgMTEuNDkzOSAxMi40OTM5TDcuMjUxMjYgOC4yNTEyNkMtNi40MTcwOSAyMS45MTk2IC02LjQxNzA5IDQ0LjA4MDQgNy4yNTEyNiA1Ny43NDg3TDExLjQ5MzkgNTMuNTA2MVpNMTIuODk1NSA1NC44MTk1QzEyLjQxNzggNTQuNDAwMyAxMS45NTAzIDUzLjk2MjUgMTEuNDkzOSA1My41MDYxTDcuMjUxMjYgNTcuNzQ4N0M3Ljc5OTkxIDU4LjI5NzQgOC4zNjI1OCA1OC44MjQzIDguOTM4MTYgNTkuMzI5M0wxMi44OTU1IDU0LjgxOTVaTTI3LjY3IDc3LjVDMjkuNTk0NSA4MC44MzMzIDM0LjQwNTcgODAuODMzMyAzNi4zMzAyIDc3LjVMMzEuMTM0MSA3NC41QzMxLjUxOSA3My44MzMzIDMyLjQ4MTIgNzMuODMzMyAzMi44NjYxIDc0LjVMMjcuNjcgNzcuNVpNNTIuNTA2MSA1My41MDYxQzUyLjA0OTcgNTMuOTYyNSA1MS41ODIzIDU0LjQwMDIgNTEuMTA0NiA1NC44MTkzTDU1LjA2MjEgNTkuMzI5MkM1NS42Mzc2IDU4LjgyNDIgNTYuMjAwMiA1OC4yOTczIDU2Ljc0ODcgNTcuNzQ4N0w1Mi41MDYxIDUzLjUwNjFaTTUyLjUwNjEgMTIuNDkzOUM2My44MzEzIDIzLjgxOTEgNjMuODMxMyA0Mi4xODA5IDUyLjUwNjEgNTMuNTA2MUw1Ni43NDg3IDU3Ljc0ODdDNzAuNDE3MSA0NC4wODA0IDcwLjQxNzEgMjEuOTE5NiA1Ni43NDg3IDguMjUxMjZMNTIuNTA2MSAxMi40OTM5Wk0zNi4zMzAyIDc3LjVDMzguMzU2MiA3My45OTA5IDQxLjIxNDggNzEuMDA0NyA0NC41MzMxIDY4LjA5MDJDNDYuMTkxNSA2Ni42MzM3IDQ3LjkyNjggNjUuMjI2OCA0OS43MTM5IDYzLjc3OUM1MS40ODUgNjIuMzQ0MiA1My4zMDg4IDYwLjg2NzYgNTUuMDYyMSA1OS4zMjkyTDUxLjEwNDYgNTQuODE5M0M0OS40NTU0IDU2LjI2NjUgNDcuNzI0OSA1Ny42Njg1IDQ1LjkzNyA1OS4xMTY5QzQ0LjE2NTEgNjAuNTUyNSA0Mi4zMzY2IDYyLjAzMzcgNDAuNTczNyA2My41ODIyQzM3LjA0OTMgNjYuNjc3NiAzMy42MzQ3IDcwLjE2ODcgMzEuMTM0MSA3NC41TDM2LjMzMDIgNzcuNVpNOC45MzgxNiA1OS4zMjkzQzEwLjY5MTQgNjAuODY3OCAxMi41MTUyIDYyLjM0NDMgMTQuMjg2MyA2My43NzkxQzE2LjA3MzQgNjUuMjI2OSAxNy44MDg3IDY2LjYzMzggMTkuNDY3MSA2OC4wOTAzQzIyLjc4NTQgNzEuMDA0OCAyNS42NDQgNzMuOTkwOSAyNy42NyA3Ny41TDMyLjg2NjEgNzQuNUMzMC4zNjU0IDcwLjE2ODcgMjYuOTUwOSA2Ni42Nzc2IDIzLjQyNjUgNjMuNTgyMkMyMS42NjM1IDYyLjAzMzggMTkuODM1MSA2MC41NTI1IDE4LjA2MzIgNTkuMTE3QzE2LjI3NTMgNTcuNjY4NiAxNC41NDQ4IDU2LjI2NjYgMTIuODk1NSA1NC44MTk1TDguOTM4MTYgNTkuMzI5M1oiIGZpbGw9IiMwQkFBRUMiIGZpbGwtb3BhY2l0eT0iMC4zIiBtYXNrPSJ1cmwoI3BhdGgtNC1pbnNpZGUtMV8xMDBfMTI3OTEpIi8+CjxwYXRoIGQ9Ik0zMy4xIDQxSDMxLjM4VjMxLjAyQzMxLjM4IDMwLjYzMzMgMzEuMzggMzAuMzA2NyAzMS4zOCAzMC4wNEMzMS4zOTMzIDI5Ljc3MzMgMzEuNDA2NyAyOS41MjY3IDMxLjQyIDI5LjNDMzEuNDMzMyAyOS4wNiAzMS40NDY3IDI4LjgxMzMgMzEuNDYgMjguNTZDMzEuMjQ2NyAyOC43NzMzIDMxLjA1MzMgMjguOTUzMyAzMC44OCAyOS4xQzMwLjcwNjcgMjkuMjQ2NyAzMC40ODY3IDI5LjQzMzMgMzAuMjIgMjkuNjZMMjguNyAzMC45TDI3Ljc4IDI5LjcyTDMxLjY0IDI2LjcySDMzLjFWNDFaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNTIuOCAxMy4xOTk2QzU2LjAwMzIgMTMuMTk5NiA1OC42IDEwLjYwMjkgNTguNiA3LjM5OTYxQzU4LjYgNC4xOTYzNiA1Ni4wMDMyIDEuNTk5NjEgNTIuOCAxLjU5OTYxQzQ5LjU5NjcgMS41OTk2MSA0NyA0LjE5NjM2IDQ3IDcuMzk5NjFDNDcgMTAuNjAyOSA0OS41OTY3IDEzLjE5OTYgNTIuOCAxMy4xOTk2WiIgZmlsbD0iIzM5QzE4OSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfMTAwXzEyNzkxIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDMxLjQwNjUgNzUuOTI4KSByb3RhdGUoMTgwKSBzY2FsZSg4LjIxODEyIDEuOTY4NjEpIj4KPHN0b3AvPgo8c3RvcCBvZmZzZXQ9IjAuMTUyMjM4IiBzdG9wLWNvbG9yPSIjMjQyOTJGIi8+CjxzdG9wIG9mZnNldD0iMC40NjE4ODgiIHN0b3AtY29sb3I9IiMxMzE2MTkiIHN0b3Atb3BhY2l0eT0iMC41MzI1MzQiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLW9wYWNpdHk9IjAuMDEiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K",
          width: "64",
          height: "83",
          offset: [0, 0]
        }
      },
      // {
      //   id: "c6c3f90a-e9b4-452f-83fa-6d1f8d41390d",
      //   coordinates: [-122.30277079180655, 37.55440211128459],
      //   name: "Trader Joes",
      //   address: "1820-22 S Grant St, San Mateo, CA 94402"
      // },
      {
        id: "ad967013-f006-4c29-adfb-be8a815ee48a",
        coordinates: [-121.91602743543594, 37.36748741841187],
        name: "",
        address: "100 Century Center Court",
        icon: {
          url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iODMiIHZpZXdCb3g9IjAgMCA2NCA4MyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgc3R5bGU9Im1peC1ibGVuZC1tb2RlOm11bHRpcGx5IiBvcGFjaXR5PSIwLjI5OTI0NyI+CjxlbGxpcHNlIGN4PSIzMi4wMDAyIiBjeT0iNzYuMzMzIiByeD0iMTQuNjY2NyIgcnk9IjYiIGZpbGw9InVybCgjcGFpbnQwX3JhZGlhbF8xMDBfMTI3OTEpIi8+CjwvZz4KPHJlY3QgeD0iNjQiIHk9IjEiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgcng9IjMyIiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NCAxKSIgZmlsbD0iIzJCQUVGRiIvPgo8cmVjdCB4PSI2Mi41IiB5PSIyLjUiIHdpZHRoPSI2MSIgaGVpZ2h0PSI2MSIgcng9IjMwLjUiIHRyYW5zZm9ybT0icm90YXRlKDkwIDYyLjUgMi41KSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxtYXNrIGlkPSJwYXRoLTQtaW5zaWRlLTFfMTAwXzEyNzkxIiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNTQuNjI3NCAxMC4zNzI2QzQyLjEzMDYgLTIuMTI0MTkgMjEuODY5NCAtMi4xMjQxOSA5LjM3MjU4IDEwLjM3MjZDLTMuMTI0MTkgMjIuODY5NCAtMy4xMjQxOSA0My4xMzA2IDkuMzcyNTggNTUuNjI3NEM5Ljg3NTEyIDU2LjEzIDEwLjM5MDIgNTYuNjEyMyAxMC45MTY4IDU3LjA3NDRDMTcuNzIxOCA2My4wNDU2IDI1Ljc0MTQgNjguMTU5NiAzMC4yNjggNzZDMzEuMDM3OCA3Ny4zMzMzIDMyLjk2MjMgNzcuMzMzMyAzMy43MzIxIDc2QzM4LjI1ODggNjguMTU5NiA0Ni4yNzg1IDYzLjA0NTUgNTMuMDgzMyA1Ny4wNzQyQzUzLjYwOTkgNTYuNjEyMiA1NC4xMjQ5IDU2LjEyOTkgNTQuNjI3NCA1NS42Mjc0QzY3LjEyNDIgNDMuMTMwNiA2Ny4xMjQyIDIyLjg2OTQgNTQuNjI3NCAxMC4zNzI2WiIvPgo8L21hc2s+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNTQuNjI3NCAxMC4zNzI2QzQyLjEzMDYgLTIuMTI0MTkgMjEuODY5NCAtMi4xMjQxOSA5LjM3MjU4IDEwLjM3MjZDLTMuMTI0MTkgMjIuODY5NCAtMy4xMjQxOSA0My4xMzA2IDkuMzcyNTggNTUuNjI3NEM5Ljg3NTEyIDU2LjEzIDEwLjM5MDIgNTYuNjEyMyAxMC45MTY4IDU3LjA3NDRDMTcuNzIxOCA2My4wNDU2IDI1Ljc0MTQgNjguMTU5NiAzMC4yNjggNzZDMzEuMDM3OCA3Ny4zMzMzIDMyLjk2MjMgNzcuMzMzMyAzMy43MzIxIDc2QzM4LjI1ODggNjguMTU5NiA0Ni4yNzg1IDYzLjA0NTUgNTMuMDgzMyA1Ny4wNzQyQzUzLjYwOTkgNTYuNjEyMiA1NC4xMjQ5IDU2LjEyOTkgNTQuNjI3NCA1NS42Mjc0QzY3LjEyNDIgNDMuMTMwNiA2Ny4xMjQyIDIyLjg2OTQgNTQuNjI3NCAxMC4zNzI2WiIgZmlsbD0iIzA1NUI4NyIvPgo8cGF0aCBkPSJNOS4zNzI1OCAxMC4zNzI2TDcuMjUxMjYgOC4yNTEyNkw5LjM3MjU4IDEwLjM3MjZaTTU0LjYyNzQgMTAuMzcyNkw1Ni43NDg3IDguMjUxMjZWOC4yNTEyNkw1NC42Mjc0IDEwLjM3MjZaTTkuMzcyNTggNTUuNjI3NEwxMS40OTM5IDUzLjUwNjFMOS4zNzI1OCA1NS42Mjc0Wk01NC42Mjc0IDU1LjYyNzRMNTYuNzQ4NyA1Ny43NDg3TDU0LjYyNzQgNTUuNjI3NFpNMTEuNDkzOSAxMi40OTM5QzIyLjgxOTEgMS4xNjg3IDQxLjE4MDkgMS4xNjg3IDUyLjUwNjEgMTIuNDkzOUw1Ni43NDg3IDguMjUxMjZDNDMuMDgwNCAtNS40MTcwOSAyMC45MTk2IC01LjQxNzA5IDcuMjUxMjYgOC4yNTEyNkwxMS40OTM5IDEyLjQ5MzlaTTExLjQ5MzkgNTMuNTA2MUMwLjE2ODY5OSA0Mi4xODA5IDAuMTY4Njk5IDIzLjgxOTEgMTEuNDkzOSAxMi40OTM5TDcuMjUxMjYgOC4yNTEyNkMtNi40MTcwOSAyMS45MTk2IC02LjQxNzA5IDQ0LjA4MDQgNy4yNTEyNiA1Ny43NDg3TDExLjQ5MzkgNTMuNTA2MVpNMTIuODk1NSA1NC44MTk1QzEyLjQxNzggNTQuNDAwMyAxMS45NTAzIDUzLjk2MjUgMTEuNDkzOSA1My41MDYxTDcuMjUxMjYgNTcuNzQ4N0M3Ljc5OTkxIDU4LjI5NzQgOC4zNjI1OCA1OC44MjQzIDguOTM4MTYgNTkuMzI5M0wxMi44OTU1IDU0LjgxOTVaTTI3LjY3IDc3LjVDMjkuNTk0NSA4MC44MzMzIDM0LjQwNTcgODAuODMzMyAzNi4zMzAyIDc3LjVMMzEuMTM0MSA3NC41QzMxLjUxOSA3My44MzMzIDMyLjQ4MTIgNzMuODMzMyAzMi44NjYxIDc0LjVMMjcuNjcgNzcuNVpNNTIuNTA2MSA1My41MDYxQzUyLjA0OTcgNTMuOTYyNSA1MS41ODIzIDU0LjQwMDIgNTEuMTA0NiA1NC44MTkzTDU1LjA2MjEgNTkuMzI5MkM1NS42Mzc2IDU4LjgyNDIgNTYuMjAwMiA1OC4yOTczIDU2Ljc0ODcgNTcuNzQ4N0w1Mi41MDYxIDUzLjUwNjFaTTUyLjUwNjEgMTIuNDkzOUM2My44MzEzIDIzLjgxOTEgNjMuODMxMyA0Mi4xODA5IDUyLjUwNjEgNTMuNTA2MUw1Ni43NDg3IDU3Ljc0ODdDNzAuNDE3MSA0NC4wODA0IDcwLjQxNzEgMjEuOTE5NiA1Ni43NDg3IDguMjUxMjZMNTIuNTA2MSAxMi40OTM5Wk0zNi4zMzAyIDc3LjVDMzguMzU2MiA3My45OTA5IDQxLjIxNDggNzEuMDA0NyA0NC41MzMxIDY4LjA5MDJDNDYuMTkxNSA2Ni42MzM3IDQ3LjkyNjggNjUuMjI2OCA0OS43MTM5IDYzLjc3OUM1MS40ODUgNjIuMzQ0MiA1My4zMDg4IDYwLjg2NzYgNTUuMDYyMSA1OS4zMjkyTDUxLjEwNDYgNTQuODE5M0M0OS40NTU0IDU2LjI2NjUgNDcuNzI0OSA1Ny42Njg1IDQ1LjkzNyA1OS4xMTY5QzQ0LjE2NTEgNjAuNTUyNSA0Mi4zMzY2IDYyLjAzMzcgNDAuNTczNyA2My41ODIyQzM3LjA0OTMgNjYuNjc3NiAzMy42MzQ3IDcwLjE2ODcgMzEuMTM0MSA3NC41TDM2LjMzMDIgNzcuNVpNOC45MzgxNiA1OS4zMjkzQzEwLjY5MTQgNjAuODY3OCAxMi41MTUyIDYyLjM0NDMgMTQuMjg2MyA2My43NzkxQzE2LjA3MzQgNjUuMjI2OSAxNy44MDg3IDY2LjYzMzggMTkuNDY3MSA2OC4wOTAzQzIyLjc4NTQgNzEuMDA0OCAyNS42NDQgNzMuOTkwOSAyNy42NyA3Ny41TDMyLjg2NjEgNzQuNUMzMC4zNjU0IDcwLjE2ODcgMjYuOTUwOSA2Ni42Nzc2IDIzLjQyNjUgNjMuNTgyMkMyMS42NjM1IDYyLjAzMzggMTkuODM1MSA2MC41NTI1IDE4LjA2MzIgNTkuMTE3QzE2LjI3NTMgNTcuNjY4NiAxNC41NDQ4IDU2LjI2NjYgMTIuODk1NSA1NC44MTk1TDguOTM4MTYgNTkuMzI5M1oiIGZpbGw9IiMwQkFBRUMiIGZpbGwtb3BhY2l0eT0iMC4zIiBtYXNrPSJ1cmwoI3BhdGgtNC1pbnNpZGUtMV8xMDBfMTI3OTEpIi8+CjxwYXRoIGQ9Ik0zMy4xIDQxSDMxLjM4VjMxLjAyQzMxLjM4IDMwLjYzMzMgMzEuMzggMzAuMzA2NyAzMS4zOCAzMC4wNEMzMS4zOTMzIDI5Ljc3MzMgMzEuNDA2NyAyOS41MjY3IDMxLjQyIDI5LjNDMzEuNDMzMyAyOS4wNiAzMS40NDY3IDI4LjgxMzMgMzEuNDYgMjguNTZDMzEuMjQ2NyAyOC43NzMzIDMxLjA1MzMgMjguOTUzMyAzMC44OCAyOS4xQzMwLjcwNjcgMjkuMjQ2NyAzMC40ODY3IDI5LjQzMzMgMzAuMjIgMjkuNjZMMjguNyAzMC45TDI3Ljc4IDI5LjcyTDMxLjY0IDI2LjcySDMzLjFWNDFaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNTIuOCAxMy4xOTk2QzU2LjAwMzIgMTMuMTk5NiA1OC42IDEwLjYwMjkgNTguNiA3LjM5OTYxQzU4LjYgNC4xOTYzNiA1Ni4wMDMyIDEuNTk5NjEgNTIuOCAxLjU5OTYxQzQ5LjU5NjcgMS41OTk2MSA0NyA0LjE5NjM2IDQ3IDcuMzk5NjFDNDcgMTAuNjAyOSA0OS41OTY3IDEzLjE5OTYgNTIuOCAxMy4xOTk2WiIgZmlsbD0iIzM5QzE4OSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfMTAwXzEyNzkxIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDMxLjQwNjUgNzUuOTI4KSByb3RhdGUoMTgwKSBzY2FsZSg4LjIxODEyIDEuOTY4NjEpIj4KPHN0b3AvPgo8c3RvcCBvZmZzZXQ9IjAuMTUyMjM4IiBzdG9wLWNvbG9yPSIjMjQyOTJGIi8+CjxzdG9wIG9mZnNldD0iMC40NjE4ODgiIHN0b3AtY29sb3I9IiMxMzE2MTkiIHN0b3Atb3BhY2l0eT0iMC41MzI1MzQiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLW9wYWNpdHk9IjAuMDEiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K",
          width: "64",
          height: "83",
          offset: [0, 0]
        }
      }
    ];
  }

  private getWaypointsFromDataSet(
    dataset: DataSet,
    fieldMappings: FieldMappings
  ): Waypoint[] {
    if (dataset.loading) {
      return [];
    }

    const records = dataset.sortedRecordIds
      .slice(0, Math.min(MAX_WAYPOINTS, dataset.sortedRecordIds.length))
      .map((recordId: string) => dataset.records[recordId]);

    const waypoints: Waypoint[] = [];

    records.forEach((record: DataSetInterfaces.EntityRecord) => {
      const latitude = record.getValue(fieldMappings.latitude) as number;
      const longitude = record.getValue(fieldMappings.longitude) as number;
      const name = record.getValue(fieldMappings.name) as string;
      const address = record.getValue(fieldMappings.address) as string;
      const url = record.getValue(fieldMappings.iconUrl) as string;
      const haveCoords = !_isNil(latitude) && !_isNil(longitude);
      const haveIcon = !_isEmpty(url);

      if (haveCoords) {
        const coordinates = [Number(longitude), Number(latitude)] as [
          number,
          number
        ];

        waypoints.push({
          coordinates,
          name,
          address,
          ...(haveIcon && {
            icon: {
              url,
              width: record.getValue(fieldMappings.iconWidth) as number,
              height: record.getValue(fieldMappings.iconHeight) as number,
              anchor: record.getValue(fieldMappings.iconAnchor) as string,
              offset: [
                (record.getValue(fieldMappings.iconOffsetX) as number) || 0,
                (record.getValue(fieldMappings.iconOffsetY) as number) || 0
              ]
            }
          })
        });
      }
    });

    return waypoints;
  }

  private getRawParameter(
    context: ComponentFramework.Context<IInputs>,
    name: string,
    defaultValue?: any
  ): any {
    const parameter = (context.parameters as { [key: string]: any })[name];
    if (parameter && parameter.raw !== "val") {
      return parameter.raw;
    }
    return defaultValue;
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    return {
      navigationState: this.navigationState,
      componentExit: this.componentExit
    };
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
