import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MarinaProvider } from "./context/MarinaContext.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MarinaProvider>
          <App />
        </MarinaProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
