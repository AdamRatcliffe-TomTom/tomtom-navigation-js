import React from "react";
import { Provider as StoreProvider } from "react-redux";
import { store } from "./app/store";
import App from "./app/App";

import "./css/TomTomNavigation.css";

function Navigation(props) {
  return (
    <StoreProvider store={store}>
      <App {...props} />
    </StoreProvider>
  );
}

export default Navigation;
