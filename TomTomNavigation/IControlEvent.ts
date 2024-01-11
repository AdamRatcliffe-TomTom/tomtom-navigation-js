export interface IControlEvent {
  name:
    | "OnRouteCalculated"
    | "OnNavigationStarted"
    | "OnNavigationStopped"
    | "OnProgressUpdate"
    | "OnDestinationReached"
    | "OnExit";
  value?: any;
}
