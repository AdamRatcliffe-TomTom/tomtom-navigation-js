import LocalizedStrings from "react-localization";

const strings = new LocalizedStrings({
  "en-US": {
    stops: "stops",
    exit: "Exit",
    street: "Street",
    satellite: "Satellite",
    location: "Location",
    locationServicesUnavailable:
      "Location services not supported for this device",
    locationServicesNotEnabled:
      "Location services not enabled. Enable to use your current location",
    ok: "OK",
    go: "Go",
    chooseMap: "Choose Map",
    limit: "Speed Limit",
    arrived: "Arrived",
    endRoute: "End Route",
    guidanceAnnouncement: "{maneuverText} in {distance} {units}",
    guidanceAnnouncementOntoStreet:
      "{maneuverText} in {distance} {units} onto {street}",
    ARRIVING: "You will arrive at your destination",
    ARRIVE: "You have arrived at your destination",
    ARRIVE_LEFT: "You have arrived. Your destination is on the left",
    ARRIVE_RIGHT: "You have arrived. Your destination is on the right",
    DEPART: "Leave",
    STRAIGHT: "Keep straight on",
    KEEP_RIGHT: "Keep right",
    BEAR_RIGHT: "Bear right",
    TURN_RIGHT: "Turn right",
    SHARP_RIGHT: "Turn sharp right",
    KEEP_LEFT: "Keep left",
    BEAR_LEFT: "Bear left",
    TURN_LEFT: "Turn left",
    SHARP_LEFT: "Turn sharp left",
    MAKE_UTURN: "Make a u-turn",
    ENTER_MOTORWAY: "Take the motorway",
    ENTER_FREEWAY: "Take the freeway",
    ENTER_HIGHWAY: "Take the highway",
    TAKE_EXIT: "Take the exit",
    MOTORWAY_EXIT_LEFT: "Take the left exit",
    MOTORWAY_EXIT_RIGHT: "Take the right exit",
    TAKE_FERRY: "Take the ferry",
    ROUNDABOUT_CROSS: "Cross the roundabout",
    ROUNDABOUT_RIGHT: "At the roundabout take the exit on the right",
    ROUNDABOUT_LEFT: "At the roundabout take the exit on the left",
    ROUNDABOUT_BACK: "Go around the roundabout",
    TRY_MAKE_UTURN: "Try to make a U-turn",
    FOLLOW: "Follow",
    SWITCH_PARALLEL_ROAD: "Switch to the parallel road",
    SWITCH_MAIN_ROAD: "Switch to the main road",
    ENTRANCE_RAMP: "Take the ramp",
    WAYPOINT_LEFT: "You have reached the waypoint. It is on the left",
    WAYPOINT_RIGHT: "You have reached the waypoint. It is on the right",
    WAYPOINT_REACHED: "You have reached the waypoint",
    AHEAD_KEEP_RIGHT: "Keep right ahead",
    AHEAD_RIGHT_TURN: "Make a right turn ahead",
    AHEAD_KEEP_LEFT: "Keep left ahead",
    AHEAD_LEFT_TURN: "Make a left turn ahead",
    AHEAD_UTURN: "Make a u-turn ahead",
    AHEAD_EXIT: "Exit ahead",
    AHEAD_EXIT_RIGHT: "Exit right ahead",
    AHEAD_EXIT_LEFT: "Exit left ahead",
    AHEAD_TAKE_FERRY: "Take the ferry ahead",
    WAYPOINT_APPROACH: "Approaching waypoint"
  },
  de: {
    stops: "haltestellen",
    exit: "Ende",
    street: "Straße",
    satellite: "Satellit",
    location: "Standort",
    locationServicesUnavailable:
      "Ortungsdienste werden für dieses Gerät nicht unterstützt",
    locationServicesNotEnabled:
      "Ortungsdienste nicht aktiviert. Aktivieren Sie diese Option, um Ihren aktuellen Standort zu verwenden",
    ok: "OK",
    arrived: "Angekommen"
  },
  nl: {
    stops: "haltes",
    exit: "Stop",
    street: "Straat",
    satellite: "Satelliet",
    location: "Plaats",
    locationServicesUnavailable:
      "Locatieservices worden niet ondersteund voor dit apparaat",
    locationServicesNotEnabled:
      "Locatieservices zijn niet ingeschakeld. Schakel in om uw huidige locatie te gebruiken",
    ok: "OK",
    arrived: "Aangekomen"
  }
});

export default strings;
