import React, { useEffect } from "react";
import { useDispatch, batch } from "react-redux";
import { ThemeProvider } from "@fluentui/react";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./store";
import AppContextProvider from "./AppContext";
import Map from "../features/map/Map";
import Navigation from "../features/navigation/Navigation";

import { setCenter, setZoom, setRouteOptions } from "../features/map/mapSlice";

// Use the wrapper to save shared state to the store
function Wrapper({ initialCenter, initialZoom, routeOptions, children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    batch(() => {
      if (initialCenter) dispatch(setCenter(initialCenter));
      if (initialZoom) dispatch(setZoom(initialZoom));
    });
  }, []);

  useEffect(() => {
    dispatch(setRouteOptions(routeOptions));
  }, [routeOptions]);

  return <div className="TomTomNavigation">{children}</div>;
}

function App({
  apiKey,
  width,
  height,
  simulationSpeed,
  theme,
  mapOptions,
  ...otherProps
}) {
  return (
    <StoreProvider store={store}>
      <ThemeProvider>
        <AppContextProvider
          apiKey={apiKey}
          width={width}
          height={height}
          simulationSpeed={simulationSpeed}
          theme={theme}
        >
          <Wrapper {...otherProps}>
            <Map {...mapOptions}>
              <Navigation />
            </Map>
          </Wrapper>
        </AppContextProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}

export default App;
