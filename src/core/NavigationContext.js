import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef
} from "react";
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
  width: initialWidth, // Can be %, vw, vh, px
  height: initialHeight,
  theme,
  guidanceVoice,
  guidanceVoiceVolume,
  guidanceVoicePlaybackRate,
  safeAreaInsets,
  mapStyles = {}
}) {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0
  });

  // Additional states needed for the context
  const [measurementSystemAuto, setMeasurementSystemAuto] = useState("metric");
  const [guidancePanelHeight, setGuidancePanelHeight] = useState(0);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { isPhone, isTablet } = calculateDeviceType(containerSize.width);

  const contextValue = useMemo(() => {
    const streetStyles = mapStyles.street || {};
    const drivingStyles = mapStyles.driving || {};

    return {
      apiKey,
      language,
      width: containerSize.width,
      height: containerSize.height,
      isPortrait: containerSize.height > containerSize.width,
      isLandscape: containerSize.width > containerSize.height,
      isPhone,
      isTablet,
      landscapeMinimal: containerSize.height < 500,
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
    containerSize.width,
    containerSize.height,
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
    <NavigationContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        style={{
          width: initialWidth || "100%",
          height: initialHeight || "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {children}
      </div>
    </NavigationContext.Provider>
  );
}
