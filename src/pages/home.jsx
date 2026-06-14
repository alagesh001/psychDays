import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { socket } from "../components/socketget";
import { useRoom } from "../components/roomprovider";
function Home() {
  const { setRoomIdGlobal } = useRoom();

    const [showRoomDialog, setShowRoomDialog] = useState(false);
    const [roomMessage, setRoomMessage] = useState("");
    
      const [isConnected, setIsConnected] = useState(false);
    const [socketError, setSocketError] = useState(null);
    const [roomId, setRoomId] = useState("");
useEffect(() => {
   
  const onConnect = () => {
    setIsConnected(true);
    console.log("Connected:", socket.id);
  };

  const onError = (err) => {
    setIsConnected(false);
    setSocketError("Connection failed");
    console.log(err.message);
  };

  const onRoomJoin = () => {
    console.log("Join Success");
    setRoomMessage("Join Success");
  };

  const onRoomFull = () => {
    console.log("Room is full.");
    setRoomMessage("Room is full. Try another room.");
  };

  socket.on("connect", onConnect);
  socket.on("connect_error", onError);
  socket.on("roomFull", onRoomFull);
  socket.on("joinedRoom", onRoomJoin);

  return () => {
    socket.off("connect", onConnect);
    socket.off("connect_error", onError);
    socket.off("roomFull", onRoomFull);
    socket.off("joinedRoom", onRoomJoin);
  };
}, []);

const connectSocket = () => {
  if (!roomId.trim()) {
    setSocketError("Please enter a Room ID");
    return;
  }

  setSocketError(null);
console.log("Connecting:");
  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("joinRoom", roomId);
setRoomIdGlobal(roomId);
  
};
const disconnectSocket = () => {
  socket.disconnect();
  setIsConnected(false);
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        {showRoomDialog && (
  <div className="z-100 fixed inset-0 bg-black/40 flex items-center justify-center">
    <div className="bg-white p-5 rounded-lg w-80 space-y-4">

      <h2 className="text-lg font-semibold">Enter Room ID</h2>

      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        placeholder="Room ID"
      />

      {socketError && (
        <p className="text-red-500 text-sm">{socketError}</p>
      )}

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowRoomDialog(false)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            connectSocket();
            setShowRoomDialog(false);
          }}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Join
        </button>
      </div>
    </div>
  </div>
)}
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Module 1
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          🌟Premium Version🌟
        </p>

        <div className="space-y-4">

          <Link
            to="/activity1"
            className="group block p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100 group hover:bg-blue-100 transition">
  <div>
    <h2 className="font-semibold text-gray-800 group-hover:text-blue-700">
      Activity 1
    </h2>
    <p className="text-xs text-gray-500">
      Start interactive session
    </p>
  </div>

  <span className="text-blue-500 text-lg group-hover:translate-x-1 transition">
    →
  </span>
</div>
          </Link>

          <Link
            to="/activity2"
            className="group block p-4 rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-md transition-all duration-200"
          >
          <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-100 group hover:bg-green-100 transition">
  <div>
    <h2 className="font-semibold text-gray-800 group-hover:text-green-700">
      Activity 2
    </h2>
    <p className="text-xs text-gray-500">
      Audio based viewer
    </p>
  </div>

  <span className="text-green-500 text-lg group-hover:translate-x-1 transition">
    →
  </span>
</div>
          </Link>
  <button
        onClick={() => {
          setShowRoomDialog(true);
        }}
        className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 group hover:bg-gray-100 transition"
      >
        Join Room
      </button>
      {roomMessage && (
  <div className="text-red-600 font-semibold">
    {roomMessage}
  </div>
)}
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          v1.0 • Interactive Board System
        </div>
      </div>
    </div>
  );
}

export default Home;