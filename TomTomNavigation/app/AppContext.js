import { createContext, useContext, useMemo } from "react";

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export default function AppContextProvider({ children, width, height }) {
  const contextValue = useMemo(
    () => ({
      width,
      height,
      isPhone: width <= 428,
      isTablet: width > 428
    }),
    [width, height]
  );

  return <AppContext.Provider value={contextValue} children={children} />;
}
