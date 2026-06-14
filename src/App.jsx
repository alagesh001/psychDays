import { Routes, Route, Navigate } from "react-router-dom";
import FullWidthImage from "./pages/audioactivity";
import SharedBoard from "./pages/testsocket";
import AudioActivityViewer from "./pages/audioact";
import Home from "./pages/home";

export default function App() {
  return (
    <Routes>
      {/* Redirect root to /activity */}

      {/* Activity page */}
            <Route path="/" element={<Home />} />

      <Route path="/activity1" element={<SharedBoard />} />
      <Route path="/audioedit" element={<FullWidthImage />} />
      <Route path="/activity2" element={<AudioActivityViewer />} />

    </Routes>
  );
}