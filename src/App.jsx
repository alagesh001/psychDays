import { Routes, Route, Navigate } from "react-router-dom";
import FullWidthImage from "./pages/audioactivity";
import SharedBoard from "./pages/testsocket";

export default function App() {
  return (
    <Routes>
      {/* Redirect root to /activity */}

      {/* Activity page */}
      <Route path="/" element={<SharedBoard />} />
      <Route path="/audio" element={<FullWidthImage />} />

    </Routes>
  );
}