import { Routes, Route, Navigate } from "react-router-dom";
import SharedBoard from "./pages/testsocket";

export default function App() {
  return (
    <Routes>
      {/* Redirect root to /activity */}

      {/* Activity page */}
      <Route path="/activity" element={<SharedBoard />} />

    </Routes>
  );
}