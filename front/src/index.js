import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import App from "./components/App";
import "reset-css";

// css imports
import theme from "./theme";
import "./index.css";

import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root")); // get root element from index.html file

// render the App component inside the root element
root.render(
  <React.StrictMode>
    {/* Adding the theme from mui to our components */}
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
