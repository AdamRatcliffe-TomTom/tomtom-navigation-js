// Service configuration
export const BASE_ROUTING_URL =
  "https://api.tomtom.com/maps/orbis/routing/calculateRoute";
export const MS_SPEECH_SERVICE_REGION = "westus";
export const MS_SPEECH_SERVICE_SUBSCRIPTION_KEY =
  "a375b87b16144978a9e865e9a75f5d65";

// Map
export const FIT_BOUNDS_PADDING_TOP = 96; // Allow space for icon a typical sized icon with anchor set to 'bottom'
export const FIT_BOUNDS_PADDING_RIGHT = 48;
export const FIT_BOUNDS_PADDING_BOTTOM = 48;
export const FIT_BOUNDS_PADDING_LEFT = 48;

// Routing
export const MAX_WAYPOINTS = 150;

// Navigation
export const LANE_GUIDANCE_TRIGGER_DISTANCE_METERS = 500;
export const TRAFFIC_EVENT_TRIGGER_DISTANCE_METERS = 5000;
export const MAX_TRAFFIC_EVENTS = 2;
export const VEHICLE_NAVIGATION_SIMULATION_ZOOM = 17;
export const PEDESTRIAN_NAVIGATION_SIMULATION_ZOOM = 20;

// Dimensions
export const TABLET_PANEL_WIDTH = 390;
export const ETA_PANEL_HEIGHT = 96;
export const ARRIVAL_PANEL_HEIGHT = 226;
export const DEFAULT_SAFE_AREA_INSETS = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};

// Misc
export const EVENT_PREFIX = "TomTomNavigation";
