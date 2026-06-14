import { useEffect, useState } from "react";
import { socket } from "../components/socketget";
import { useRoom } from "../components/roomprovider";

const API_BASE = "https://oxadmedia.online/api";

export default function AudioActivityViewer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);
const [audioPlayer] = useState(() => new Audio());
const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  );
   useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
const playAudio = (pointerId,pointerAudio) => {
  audioPlayer.pause();

  audioPlayer.src = pointerAudio;

  audioPlayer.currentTime = 0;
  audioPlayer.play();
};
  const loadData = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/data/audiodata.json`
      );

      const json = await res.json();
      console.log("Success ", json);

      setData(json);
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  if (!data) {
    return (
      <div className="p-4 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gray-100">
       {isPortrait && (
  <div className="fixed inset-0 bg-white z-50">
    <div className="w-full text-center pt-8">
      <h1 className="text-2xl font-bold">
        Please rotate your device to landscape mode
      </h1>
    </div>
  </div>
)}
      <div className="relative mx-auto">
        <img
          src={`${API_BASE}/data/image.webp?v=${Date.now()}`}
          alt=""
          className="h-auto block mx-auto"
          style={{
            width: `${data.widthPercent}%`,
            maxWidth: "100vw",
          }}
        />

      {data.pointers?.map((pointer) => (
  <div
    key={pointer.id}
    onClick={() => playAudio(pointer.id,pointer.audio)}
    className="absolute w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold -translate-x-1/2 -translate-y-1/2 cursor-pointer"
    style={{
      left: `${50 + pointer.xPercent / 2}%`,
      top: `${pointer.yPercent}%`,
    }}
  >
    {pointer.id}
  </div>
))}
      </div>
    </div>
  );
}