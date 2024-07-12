import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import Home from "./pages/home.tsx";
import "./styles/home.css";
import "./styles/dashboard.css";
import Dashboard from "./pages/dashboard.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<Navigate to="/" />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
