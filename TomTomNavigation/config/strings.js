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
    endRoute: "End Route"
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
