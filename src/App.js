import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BMWShowcase from "./components/BMWShowcase";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BMWShowcase />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;