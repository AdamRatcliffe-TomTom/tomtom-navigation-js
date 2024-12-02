import React, { createContext, useContext, useMemo, useState } from "react";
import strings from "../config/strings";

const NavigationContext = createContext();

export function useNavigationContext() {
  return useContext(NavigationContext);
}

export function calculateDeviceType(width) {
  const isPhone = width <= 428;
  const isTablet = width > 428;
  return { isPhone, isTablet };
}

export default function NavigationContextProvider({
  children,
  apiKey,
  language = navigator.language,
  measurementSystem = "metric",
  width,
  height,
  simulationSpeed,
  theme,
  guidanceVoice,
  guidanceVoiceVolume,
  guidanceVoicePlaybackRate,
  safeAreaInsets,
  mapStyles = {} // New prop for style overrides
}) {
  const [measurementSystemAuto, setMeasurementSystemAuto] = useState("metric");
  const [guidancePanelHeight, setGuidancePanelHeight] = useState(0);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(0);
  const { isPhone, isTablet } = calculateDeviceType(width);

  const contextValue = useMemo(() => {
    const streetStyles = mapStyles.street || {};
    const drivingStyles = mapStyles.driving || {};

    return {
      apiKey,
      language,
      width,
      height,
      simulationSpeed,
      isPortrait: height > width,
      isLandscape: width > height,
      isPhone,
      isTablet,
      landscapeMinimal: height < 500,
      theme,
      guidanceVoice,
      guidanceVoiceVolume,
      guidanceVoicePlaybackRate,
      safeAreaInsets,
      guidancePanelHeight,
      setGuidancePanelHeight,
      bottomPanelHeight,
      setBottomPanelHeight,
      mapStyles: {
        street: {
          name: "street",
          label: strings.street,
          style:
            theme === "light"
              ? streetStyles.light ||
                `https://api.tomtom.com/maps/orbis/assets/styles/0.2.*/style.json?apiVersion=1&map=basic_street-light&trafficFlow=flow_relative-light&trafficIncidents=incidents_light`
              : streetStyles.dark ||
                `https://api.tomtom.com/maps/orbis/assets/styles/0.2.*/style.json?apiVersion=1&map=basic_street-dark&trafficFlow=flow_relative-dark&trafficIncidents=incidents_dark`,
          styleDriving:
            theme === "light"
              ? drivingStyles.light ||
                `https://api.tomtom.com/maps/orbis/assets/styles/0.2.*/style.json?apiVersion=1&map=basic_street-light-driving&trafficFlow=flow_relative-light&trafficIncidents=incidents_light`
              : drivingStyles.dark ||
                `https://api.tomtom.com/maps/orbis/assets/styles/0.2.*/style.json?apiVersion=1&map=basic_street-dark-driving&trafficFlow=flow_relative-dark&trafficIncidents=incidents_dark`
        },
        satellite: {
          name: "satellite",
          label: strings.satellite,
          style:
            "https://api.tomtom.com/style/1/style/25.2.2-1?map=2/basic_street-satellite&traffic_flow=2/flow_relative-light&traffic_incidents=2/incidents_light&poi=2/poi_light"
        }
      },
      measurementSystem:
        measurementSystem === "auto"
          ? measurementSystemAuto
          : measurementSystem,
      setMeasurementSystemAuto
    };
  }, [
    apiKey,
    language,
    measurementSystem,
    measurementSystemAuto,
    width,
    height,
    simulationSpeed,
    theme,
    guidanceVoice,
    guidanceVoiceVolume,
    guidanceVoicePlaybackRate,
    safeAreaInsets,
    guidancePanelHeight,
    bottomPanelHeight,
    mapStyles
  ]);

  return (
    <NavigationContext.Provider value={contextValue} children={children} />
  );
}
