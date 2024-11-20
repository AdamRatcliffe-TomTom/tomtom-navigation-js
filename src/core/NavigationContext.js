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
  safeAreaInsets
}) {
  const [measurementSystemAuto, setMeasurementSystemAuto] = useState("metric");
  const [guidancePanelHeight, setGuidancePanelHeight] = useState(0);
  const { isPhone, isTablet } = calculateDeviceType(width);

  const contextValue = useMemo(
    () => ({
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
      mapStyles: {
        street: {
          name: "street",
          label: strings.street,
          style: `https://api.tomtom.com/maps/orbis/assets/styles/0.2.*/style.json?apiVersion=1&map=basic_street-${theme}&trafficFlow=flow_relative-${theme}&trafficIncidents=incidents_${theme}`,
          styleDriving: `https://api.tomtom.com/maps/orbis/assets/styles/0.2.*/style.json?apiVersion=1&map=basic_street-${theme}-driving&trafficFlow=flow_relative-${theme}&trafficIncidents=incidents_${theme}`
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
      guidanceVoiceVolume,
      guidanceVoicePlaybackRate,
      safeAreaInsets,
      guidancePanelHeight
    ]
  );

  return (
    <NavigationContext.Provider value={contextValue} children={children} />
  );
}
