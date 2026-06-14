import { BrowserRouter, Routes, Route } from "react-router-dom";
import FullWidthImage from "./pages/audioactivity";
import SharedBoard from "./pages/testsocket";
import AudioActivityViewer from "./pages/audioact";
import Home from "./pages/home";
import DragImage from "./components/pointer";


import { RoomProvider } from "./components/roomprovider";
export default function App() {
  return (
     <RoomProvider>
      <Routes>
        <Route path="/" element={<DragImage />} />
        <Route path="/activity1" element={<SharedBoard />} />
        <Route path="/audioedit" element={<FullWidthImage />} />
        <Route path="/activity2" element={<AudioActivityViewer />} />
      </Routes>
    </RoomProvider>
  );
}