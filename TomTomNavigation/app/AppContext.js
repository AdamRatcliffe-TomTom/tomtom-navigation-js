import { createContext, useContext, useMemo } from "react";
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
  layerHostId
}) {
  const contextValue = useMemo(
    () => ({
      apiKey,
      language,
      measurementSystem,
      width,
      height,
      simulationSpeed,
      isPhone: width <= 428,
      isTablet: width > 428,
      theme,
      layerHostId,
      mapStyles: {
        street: {
          name: "street",
          label: strings.street,
          style: `https://api.tomtom.com/style/1/style/24.4.0-0?map=10-test/basic_street-${theme}&traffic_flow=2/flow_relative-${theme}&traffic_incidents=2/incidents_${theme}&poi=2/poi_${theme}`,
          styleDriving: `https://api.tomtom.com/style/1/style/24.4.0-0?map=10-test/basic_street-${theme}-driving&traffic_flow=2/flow_relative-${theme}&traffic_incidents=2/incidents_${theme}&poi=2/poi_${theme}`
        },
        satellite: {
          name: "satellite",
          label: strings.satellite,
          style:
            "https://api.tomtom.com/style/1/style/24.*?map=2/basic_street-satellite&traffic_flow=2/flow_relative-light&traffic_incidents=2/incidents_light&poi=2/poi_light"
        }
      }
    }),
    [
      apiKey,
      language,
      measurementSystem,
      width,
      height,
      simulationSpeed,
      theme,
      layerHostId
    ]
  );

  return <AppContext.Provider value={contextValue} children={children} />;
}
