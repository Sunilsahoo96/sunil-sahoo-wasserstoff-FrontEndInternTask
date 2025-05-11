import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import EditorPage from "./pages/EditorPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/editor" element={<EditorPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
