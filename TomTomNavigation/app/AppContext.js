import { createContext, useContext, useMemo } from "react";

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export default function AppContextProvider({
  children,
  apiKey,
  width,
  height,
  simulationSpeed,
  theme
}) {
  const contextValue = useMemo(
    () => ({
      apiKey,
      width,
      height,
      simulationSpeed,
      isPhone: width <= 428,
      isTablet: width > 428,
      theme,
      mapStyles: {
        street: `https://api.tomtom.com/style/1/style/24.*?map=10-test/basic_street-${theme}&traffic_flow=2/flow_relative-${theme}&traffic_incidents=2/incidents_${theme}&poi=2/poi_${theme}`,
        satellite:
          "https://api.tomtom.com/style/1/style/24.*?map=2/basic_street-satellite&traffic_flow=2/flow_relative-light&traffic_incidents=2/incidents_light&poi=2/poi_light"
      }
    }),
    [apiKey, width, height, simulationSpeed, theme]
  );

  return <AppContext.Provider value={contextValue} children={children} />;
}
