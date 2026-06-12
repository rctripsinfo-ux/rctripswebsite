import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import RedCarpetTradeFairBookingUI from "./RedCarpetTradeFairBookingUI.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RedCarpetTradeFairBookingUI />
  </React.StrictMode>
);
