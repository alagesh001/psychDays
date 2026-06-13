import { Routes, Route, Navigate } from "react-router-dom";
import FullWidthImage from "./pages/audioactivity";
import SharedBoard from "./pages/testsocket";
import AudioActivityViewer from "./pages/audioact";

export default function App() {
  return (
    <Routes>
      {/* Redirect root to /activity */}

      {/* Activity page */}
      <Route path="/" element={<SharedBoard />} />
      <Route path="/audio" element={<FullWidthImage />} />
      <Route path="/activity2" element={<AudioActivityViewer />} />

    </Routes>
  );
}