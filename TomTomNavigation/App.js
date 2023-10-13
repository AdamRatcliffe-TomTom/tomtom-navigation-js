import React from "react";
import { ThemeProvider } from "@fluentui/react";
import { Provider } from "react-redux";
import { store } from "./store";
import AppContextProvider from "./AppContext";
import Map from "./components/Map";

const appStyle = {
  textAlign: "left"
};

function App({ width, height, ...otherProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContextProvider width={width} height={height}>
          <div className="App" style={appStyle}>
            <Map {...otherProps} />
          </div>
        </AppContextProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
