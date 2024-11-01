export interface IControlEvent {
  name:
    | "OnRouteCalculated"
    | "OnNavigationStarted"
    | "OnNavigationStopped"
    | "OnProgressUpdate"
    | "OnDestinationReached"
    | "OnExit"
    | "OnContinue";
  value?: any;
}
