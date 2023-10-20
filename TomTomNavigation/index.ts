import * as React from "react";
import * as tt from "@tomtom-international/web-sdk-maps";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import App from "./app/App";
import parseCoordinateString from "./functions/parseCoordinateString";

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
    const theme = this.getRawParameter(context, "theme");
    const initialCenter = parseCoordinateString(
      this.getRawParameter(context, "initialCenter"),
      true
    );
    const initialZoom = this.getRawParameter(context, "initialZoom");
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
    const showNavigationPanel = this.getRawParameter(
      context,
      "showNavigationPanel"
    );
    const automaticRouteCalculation = this.getRawParameter(
      context,
      "automaticRouteCalculation"
    );
    let routeWaypoints: any = parseCoordinateString(
      this.getRawParameter(context, "routeWaypoints")
    );
    if (routeWaypoints instanceof tt.LngLat) {
      routeWaypoints = [routeWaypoints];
    }
    const simulationSpeed = this.getRawParameter(context, "simulationSpeed");
    const travelMode = this.getRawParameter(context, "travelMode");
    const traffic = this.getRawParameter(context, "traffic");
    const arrivalSidePreference = this.getRawParameter(
      context,
      "arrivalSidePreference"
    );
    const width = context.mode.allocatedWidth;
    const height = context.mode.allocatedHeight;

    const mapOptions = {
      showTrafficFlow,
      showTrafficIncidents,
      showPoi,
      showLocationMarker,
      showMapSwitcherControl
    };

    const routeOptions = {
      travelMode,
      traffic,
      arrivalSidePreference,
      locations: routeWaypoints
    };

    return React.createElement(App, {
      apiKey,
      theme,
      width,
      height,
      simulationSpeed,
      initialCenter,
      initialZoom,
      mapOptions,
      routeOptions,
      showNavigationPanel,
      automaticRouteCalculation
    });
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
