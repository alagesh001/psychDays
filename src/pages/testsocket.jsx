import { useState, useEffect,useRef } from "react";
import { io } from "socket.io-client";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

const socket = io("https://oxadmedia.online");

const BOARD_WIDTH = window.innerWidth;
const BOARD_HEIGHT = 800;
const ITEM_SIZE = 80; // since w-20 = 5rem = 80px
const IMAGE_BASE = "https://oxadmedia.online/images";

function DraggableItem({ item }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  });

  return (
   <div
  ref={setNodeRef}
  style={{
    
    position: "absolute",
    left: `${item.x}%`,
    top: `${item.y }%`,
    transform: CSS.Translate.toString(transform),
  }}
>
     <div
  {...listeners}
  {...attributes}
  className="flex flex-col items-center cursor-grab active:cursor-grabbing touch-none"
>
  <img
    src={item.image}
    alt={item.label}
    className="w-16 h-16 object-cover rounded-md"
    draggable={false}
  />

  <p className="mt-1 text-center text-sm">
    {item.label}
  </p>
</div>
    </div>
  );
}

export default function SharedBoard() {
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
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

const dayColors = {
  Monday: "from-blue-500 to-cyan-400",
  Tuesday: "from-green-500 to-emerald-400",
  Wednesday: "from-yellow-500 to-amber-400",
  Thursday: "from-purple-500 to-violet-400",
  Friday: "from-pink-500 to-rose-400",
  Saturday: "from-orange-500 to-red-400",
  Sunday: "from-indigo-500 to-blue-400",
};
const API_BASE = "https://oxadmedia.online/api";
const IMAGE_BASE = "https://oxadmedia.online/api/fetchimg";
const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Monday");

 const [items, setItems] = useState([
  { id: "a", label: "Eye Test", image: `${IMAGE_BASE}/a.webp` },
  { id: "b", label: "Fishing", image: `${IMAGE_BASE}/b.webp` },
  { id: "c", label: "Fruit Seat", image: `${IMAGE_BASE}/c.webp` },
  { id: "d", label: "Ice Cream", image: `${IMAGE_BASE}/d.webp` },
  { id: "e", label: "iPad", image: `${IMAGE_BASE}/e.webp` },
  { id: "f", label: "Class", image: `${IMAGE_BASE}/f.webp` },
  { id: "g", label: "Class 2", image: `${IMAGE_BASE}/g.webp` },
  { id: "h", label: "Running", image: `${IMAGE_BASE}/h.webp` },
  { id: "i", label: "School", image: `${IMAGE_BASE}/i.webp` },
  { id: "j", label: "School Bus", image: `${IMAGE_BASE}/j.webp` },
  { id: "k", label: "Angry", image: `${IMAGE_BASE}/k.webp` },
  { id: "l", label: "Happy", image: `${IMAGE_BASE}/l.webp` },
  { id: "m", label: "Sad", image: `${IMAGE_BASE}/m.webp` },
  { id: "n", label: "Tired", image: `${IMAGE_BASE}/n.webp` },
].map((item, index) => ({
  ...item,
  isTemplate: true,

  // 4 columns
  x: 5 + (index % 6) * 15,

  // 3 rows
  y: 60 + Math.floor(index / 6) * 12,
 }))
);
const resetTemplates = () => {
  setItems((prev) => prev.filter((item) => item.isTemplate));
};
  const refreshImages = () => {
  setItems((prev) =>
    prev.map((item) => ({
      ...item,
      image: item.image.split("?")[0] + `?v=${Date.now()}`,
    }))
  );
};
const replaceImage = async (itemId, file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `${API_BASE}/upload-image/${itemId}.webp`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (data.success) {
    const updatedItem = {
  id: itemId,
  image: `${IMAGE_BASE}/${data.filename}?v=${Date.now()}`,
};
    setItems((prev) =>
  prev.map((item) =>
    item.id === itemId ? { ...item, ...updatedItem } : item
  )
);
socket.emit("replacedImage", {
  roomId: roomId,
  data: updatedItem,
});
  }
};
const fetchItems = async () => {
  try {
    const res = await fetch(`${API_BASE}/items/get-items`);
    const data = await res.json();

    const updated = data.map((item) => ({
      ...item,
      image: item.image.split("?")[0] + `?v=${Date.now()}`,
    }));

    setItems(updated);
  } catch (err) {
    console.error("Failed to fetch items:", err);
  }
};
const saveItems = async () => {
  try {
    const res = await fetch(`${API_BASE}/items/save-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(items),
    });

    const data = await res.json();

    if (data.success) {
      alert("Items saved successfully!");
    }
  } catch (err) {
    console.error("Save failed:", err);
  }
};
  const sensors = useSensors(useSensor(PointerSensor));

const [showRoomDialog, setShowRoomDialog] = useState(false);
const [roomError, setRoomError] = useState("");
const [roomSuccess, setRoomSuccess] = useState("");

  const [isConnected, setIsConnected] = useState(false);
const [socketError, setSocketError] = useState(null);
const [roomId, setRoomId] = useState("");
const connectSocket = () => {
  if (!roomId.trim()) {
    setSocketError("Please enter a Room ID");
    return;
  }

  setSocketError(null);

  if (!socket.connected) {
    socket.connect();
  }

  socket.emit("joinRoom", roomId);
};
 useEffect(() => {

      socket.emit("daySelected", {roomId: roomId,data: selectedDay});

  }, [selectedDay]);
const disconnectSocket = () => {
  socket.disconnect();
  setIsConnected(false);
};
useEffect(() => {
  refreshImages();

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
    setRoomSuccess("Join Success");
  };
  const onRoomFull = () => {
    setRoomError("Room is full. Try another room.");
  };

  const onItemCreated = (newItem) => {
    setItems((prev) => [...prev, newItem]);
  };

  const onItemMoved = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  const onReplacedImage = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === updatedItem.id
          ? { ...item, image: updatedItem.image }
          : item
      )
    );
  };

  const onDaySelected = (data) => {
    setSelectedDay(data);
  };

  socket.on("connect", onConnect);
  socket.on("connect_error", onError);
  socket.on("roomFull", onRoomFull);
    socket.on("joinedRoom", onRoomJoin);

  socket.on("itemCreated", onItemCreated);
  socket.on("itemMoved", onItemMoved);
  socket.on("replacedImage", onReplacedImage);
  socket.on("daySelected", onDaySelected);

  return () => {
    socket.off("connect", onConnect);
    socket.off("connect_error", onError);
    socket.off("roomFull", onRoomFull);
        socket.off("joinedRoom", onRoomJoin);

    socket.off("itemCreated", onItemCreated);
    socket.off("itemMoved", onItemMoved);
    socket.off("replacedImage", onReplacedImage);
    socket.off("daySelected", onDaySelected);
  };
}, []);
const boardRef = useRef(null);
const COLS = 7;
const COL_WIDTH = 100 / COLS;

function handleDragEnd(event) {
  const { delta, active } = event;

  const rect = boardRef.current.getBoundingClientRect();
  const colWidthPx = rect.width / COLS;
  const boxWidthPx = 64;

const sourceItem = items.find(
  (item) => item.id === active.id
);

if (!sourceItem) return;

  const rawPxX =
    (sourceItem.x / 100) * rect.width + delta.x;

  const col = Math.max(
    0,
    Math.min(
      COLS - 1,
      Math.floor((rawPxX + colWidthPx * 0.4) / colWidthPx)
    )
  );

  const centerPx =
    col * colWidthPx + colWidthPx / 2 - boxWidthPx / 2;

  const valuex = (centerPx / rect.width) * 100;

if (sourceItem.isTemplate) {
  const duplicate = {
    ...sourceItem,
    id: crypto.randomUUID(),
    isTemplate: false, // important
    x: valuex,
    y: sourceItem.y + (delta.y / rect.height) * 100,
  };

  setItems((prev) => [...prev, duplicate]);

  socket.emit("itemCreated", {roomId: roomId,data: duplicate});

  return;
}

setItems((prev) =>
  prev.map((item) => {
    if (item.id !== active.id) return item;

    const updated = {
      ...item,
      x: valuex,
      y: item.y + (delta.y / rect.height) * 100,
    };

    socket.emit("itemMoved", {roomId: roomId,data: updated});

    return updated;
  })
);

}

  return (
    <div className="w-screen h-screen overflow-y-auto overflow-x-hidden bg-gray-100">
      {isPortrait && (
  <div className="fixed inset-0 bg-white z-50">
    <div className="w-full text-center pt-8">
      <h1 className="text-2xl font-bold">
        Please rotate your device to landscape mode
      </h1>
    </div>
  </div>
)}

     <div
        ref={boardRef}
        className="relative overflow-hidden mx-auto bg-white border"
        style={{
          width: "100%",
          height: BOARD_HEIGHT,
        }}
      >
      <button
  onClick={refreshImages}
  className="px-4 py-2 bg-red-600 text-white rounded-lg"
>
  Refresh Images
</button>
    <button
  onClick={() => setShowImageDialog(true)}
  className="mt-5 ml-10 mb-10 px-5 py-2.5 rounded-xl
             bg-gradient-to-r from-blue-600 to-indigo-600
             text-white font-semibold shadow-lg
             hover:from-blue-700 hover:to-indigo-700
             hover:shadow-xl active:scale-95
             transition-all duration-200
             focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
>
  Manage Images
</button>
<button
  onClick={saveItems}
  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
>
  Save Layout
</button>
<button
  onClick={fetchItems}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
>
  Load Items
</button>
<button
  onClick={resetTemplates}
  className="px-4 py-2 bg-red-600 text-white rounded-lg"
>
  Reset
</button>
<button
  onClick={() => setShowRoomDialog(true)}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
>
  Join Room
</button>
{roomSuccess && (
  <div className="text-red-600 font-semibold">
    {roomSuccess}
  </div>
)}
{roomError && (
  <div className="text-red-600 font-semibold">
    {roomError}
  </div>
)}
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
{showImageDialog && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        width: "90%",
        maxWidth: 1000,
        maxHeight: "80vh",
        overflow: "auto",
        background: "#fff",
        padding: 20,
        borderRadius: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2>Manage Images</h2>

        <button
          onClick={() =>
            setShowImageDialog(false)
          }
        >
          Close
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(180px,1fr))",
          gap: 20,
        }}
      >
        {items
         .filter((item) => item.isTemplate)
        .map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <img
              src={item.image}
              alt={item.label}
              style={{
                width: "100%",
                height: 120,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />

            <div
              style={{
                marginTop: 8,
                fontWeight: 600,
              }}
            >
              {item.label}
            </div>

            <label
              style={{
                display: "inline-block",
                marginTop: 10,
                background: "#2563eb",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Replace

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file =
                    e.target.files?.[0];

                  if (file) {
                    replaceImage(
                      item.id,
                      file
                    );
                  }
                }}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
<table className="w-full table-fixed border-collapse">    
           <thead>
            {/* TODAY MARKER ROW */}
            <tr>
              {days.map((day) => (
                <th key={`marker-${day}`} className="h-8 text-center">
                  {day === selectedDay && (
                    <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                      TODAY
                    </span>
                  )}
                </th>
              ))}
            </tr>

            {/* DAY HEADINGS */}
           <tr>
  {days.map((day) => (
    <th
  key={day}
  onClick={() => setSelectedDay(day)}
  className={`w-[14.2857%] border border-gray-300 py-2 text-center cursor-pointer
    bg-gradient-to-r ${dayColors[day]}
    ${
      selectedDay === day
        ? "text-white ring-4 ring-white"
        : "text-white opacity-80"
    }`}
>
  {day}
</th>
  ))}
</tr>
          </thead>

          <tbody>
            {[1, 2, 3].map((row) => (
              <tr key={row}>
                {days.map((day) => (
                <td
  key={`${day}-${row}`}
  onClick={() => setSelectedDay(day)}
  className={`border border-gray-300
    h-24
    cursor-pointer transition-all
    ${
      selectedDay === day
        ? "bg-blue-100"
        : "bg-white hover:bg-gray-50"
    }`}
/>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
 
      
   
       <DndContext
  sensors={sensors}
  modifiers={[restrictToParentElement]}
  onDragEnd={handleDragEnd}
>
{items.map((item) => (
  <DraggableItem
    key={item.id}
    item={item}
  />
))}        </DndContext>
    </div>
    </div>
  );
}