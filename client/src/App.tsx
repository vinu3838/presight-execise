import { Routes, Route, Navigate } from "react-router-dom";
import Directory from "./pages/Directory";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Directory />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
