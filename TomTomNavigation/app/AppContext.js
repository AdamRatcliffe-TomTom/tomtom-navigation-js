import { createContext, useContext, useMemo, useState } from "react";
import strings from "../config/strings";

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export default function AppContextProvider({
  children,
  apiKey,
  language = navigator.language,
  measurementSystem = "metric",
  width,
  height,
  simulationSpeed,
  theme,
  guidanceVoice,
  layerHostId
}) {
  const [measurementSystemAuto, setMeasurementSystemAuto] = useState("metric");

  const contextValue = useMemo(
    () => ({
      apiKey,
      language,
      width,
      height,
      simulationSpeed,
      isPhone: width <= 428,
      isTablet: width > 428,
      theme,
      guidanceVoice,
      layerHostId,
      mapStyles: {
        street: {
          name: "street",
          label: strings.street,
          style: `https://api.tomtom.com/maps/orbis/assets/styles/0.2.0-0/style.json?apiVersion=1&map=basic_street-${theme}&trafficFlow=flow_relative-${theme}&trafficIncidents=incidents_${theme}`,
          styleDriving: `https://api.tomtom.com/maps/orbis/assets/styles/0.2.0-0/style.json?apiVersion=1&map=basic_street-${theme}-driving&trafficFlow=flow_relative-${theme}&trafficIncidents=incidents_${theme}`
        },
        satellite: {
          name: "satellite",
          label: strings.satellite,
          style:
            "https://api.tomtom.com/maps/orbis/assets/styles/0.2.0-0/style.json?apiVersion=1&map=basic_street-satellite&trafficFlow=flow_relative-light&trafficIncidents=incidents_light",
          styleDriving:
            "https://api.tomtom.com/maps/orbis/assets/styles/0.2.0-0/style.json?apiVersion=1&map=hillshade-satellite&trafficFlow=flow_relative-light&trafficIncidents=incidents_light"
        }
      },
      measurementSystem:
        measurementSystem === "auto"
          ? measurementSystemAuto
          : measurementSystem,
      setMeasurementSystemAuto
    }),
    [
      apiKey,
      language,
      measurementSystem,
      measurementSystemAuto,
      width,
      height,
      simulationSpeed,
      theme,
      guidanceVoice,
      layerHostId
    ]
  );

  return <AppContext.Provider value={contextValue} children={children} />;
}
