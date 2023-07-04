import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "reset-css";
import "./index.css";

import reportWebVitals from "./reportWebVitals";

// get root element from index.html file
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
