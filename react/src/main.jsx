import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { PaisesRecientesProvider } from "./context/PaisesRecientesContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PaisesRecientesProvider>
        <App />
      </PaisesRecientesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
