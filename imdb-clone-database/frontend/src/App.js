import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MovieFormPage from "./pages/MovieFormPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/add" element={<MovieFormPage />} />
        <Route path="/movies/edit/:id" element={<MovieFormPage />} />
      </Routes>
    </Router>
  );
}

export default App;