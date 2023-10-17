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
      theme
    }),
    [apiKey, width, height, simulationSpeed, theme]
  );

  return <AppContext.Provider value={contextValue} children={children} />;
}
