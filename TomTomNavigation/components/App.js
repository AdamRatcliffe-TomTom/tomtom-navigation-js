import React from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import Map from "./Map";

function App(props) {
  return (
    <Provider store={store}>
      <div className="App">
        <Map {...props} />
      </div>
    </Provider>
  );
}

export default App;
