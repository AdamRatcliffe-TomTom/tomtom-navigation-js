import React from "react";
import { ThemeProvider } from "@fluentui/react";
import { Provider } from "react-redux";
import { store } from "../store";
import Map from "./Map";

const style = {
  textAlign: "left"
};

function App(props) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="App" style={style}>
          <Map {...props} />
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
