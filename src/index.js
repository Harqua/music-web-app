import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./page/App";
import Edit from "./page/Edit";
import Share from "./page/Share";

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<App />} />
              <Route path="/Edit/:id" element={<Edit />} />
              <Route path="/Share/:id" element={<Share />} />
          </Routes>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);