import * as React from "react";
import _isNil from "lodash.isnil";
import _isEmpty from "lodash.isempty";
import { v4 as uuid } from "uuid";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import App from "./app/App";
import parseCoordinateString from "./functions/parseCoordinateString";
import detectColorScheme from "./functions/detectColorScheme";

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
  id: string;
  coordinates: [number, number];
  name?: string;
  address?: string;
  icon?: Icon;
};

export class TomTomNavigation
  implements ComponentFramework.ReactControl<IInputs, IOutputs>
{
  private notifyOutputChanged: () => void;

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
    const showNavigationPanel = this.getRawParameter(
      context,
      "showNavigationPanel"
    );
    const automaticRouteCalculation = this.getRawParameter(
      context,
      "automaticRouteCalculation"
    );
    const guidanceVoice = this.getRawParameter(context, "guidanceVoice");
    const simulationSpeed = this.getRawParameter(context, "simulationSpeed");
    const travelMode = this.getRawParameter(context, "travelMode");
    const traffic = this.getRawParameter(context, "traffic");
    const arrivalSidePreference = this.getRawParameter(
      context,
      "arrivalSidePreference"
    );

    const dataset = context.parameters.routeWaypoints;
    const waypoints = this.getWaypointsFromDataSet(dataset);

    const width = context.mode.allocatedWidth;
    const height = context.mode.allocatedHeight;

    const mapOptions = {
      enableGeolocation,
      showTrafficFlow,
      showTrafficIncidents,
      showPoi,
      showLocationMarker,
      showMapSwitcherControl,
      showMuteControl
    };

    const routeOptions = {
      language,
      travelMode,
      traffic,
      arrivalSidePreference,
      locations: waypoints
    };

    return React.createElement(App, {
      apiKey,
      theme,
      language,
      measurementSystem,
      width,
      height,
      guidanceVoice,
      simulationSpeed,
      initialCenter,
      initialZoom,
      mapOptions,
      routeOptions,
      showNavigationPanel,
      automaticRouteCalculation
    });
  }

  private getWaypointsFromDataSet(dataset: DataSet): Waypoint[] {
    if (dataset.loading) {
      return [];
    }

    const records = dataset.sortedRecordIds
      .slice(0, Math.min(MAX_WAYPOINTS, dataset.sortedRecordIds.length))
      .map((recordId: string) => dataset.records[recordId]);

    const waypoints: Waypoint[] = [];

    records.forEach((record: DataSetInterfaces.EntityRecord) => {
      const latitude = record.getValue("latitude") as number;
      const longitude = record.getValue("longitude") as number;
      const coordinates = [longitude, latitude] as [number, number];
      const name = record.getValue("name") as string;
      const address = record.getValue("address") as string;
      const url = record.getValue("iconUrl") as string;
      const haveCoords = !_isNil(latitude) && !_isNil(longitude);
      const haveIcon = !_isEmpty(url);

      if (haveCoords) {
        waypoints.push({
          id: uuid(),
          coordinates,
          name,
          address,
          ...(haveIcon && {
            icon: {
              url,
              width: record.getValue("iconWidth") as number,
              height: record.getValue("iconHeight") as number,
              anchor: record.getValue("iconAnchor") as string,
              offset: [
                (record.getValue("iconOffsetX") as number) || 0,
                (record.getValue("iconOffsetY") as number) || 0
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
    name: string
  ): any {
    const parameter = (context.parameters as { [key: string]: any })[name];
    if (parameter) {
      return parameter.raw;
    }
    return undefined;
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    return {};
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
