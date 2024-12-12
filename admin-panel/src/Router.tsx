import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage/UserPage";
import MoviePage from "./pages/MoviePage/MoviePage";
import LoginPage from "./pages/LoginPage/LoginPage";

export default function RouterComponent() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<UserPage />} />
          <Route path="/movies" element={<MoviePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  );
}
