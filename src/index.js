import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducers } from "./reducers";
import { Provider } from "react-redux";
import { createStore } from "redux";
import App from "./App";
import "./Styles/index.css";

const store = createStore(reducers, composeWithDevTools(applyMiddleware()));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
