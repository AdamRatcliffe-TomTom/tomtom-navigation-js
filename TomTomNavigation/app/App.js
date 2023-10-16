import React, { useEffect } from "react";
import { useDispatch, batch } from "react-redux";
import { ThemeProvider } from "@fluentui/react";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./store";
import AppContextProvider from "./AppContext";
import Map from "../features/map/Map";
import NavigationPanel from "../features/navigation/NavigationPanel";

import { setCenter, setZoom, setRouteOptions } from "../features/map/mapSlice";

// Use the wrapper to save shared state to the store
function Wrapper({ center, zoom, routeOptions, children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    batch(() => {
      dispatch(setCenter(center));
      dispatch(setZoom(zoom));
      dispatch(setRouteOptions(routeOptions));
    });
  }, [center, zoom, routeOptions]);

  return <div className="TomTomNavigation">{children}</div>;
}

function App({ apiKey, width, height, theme, mapOptions, ...otherProps }) {
  return (
    <StoreProvider store={store}>
      <ThemeProvider>
        <AppContextProvider
          apiKey={apiKey}
          width={width}
          height={height}
          theme={theme}
        >
          <Wrapper {...otherProps}>
            <Map {...mapOptions}>
              <NavigationPanel />
            </Map>
          </Wrapper>
        </AppContextProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}

export default App;
