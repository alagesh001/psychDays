import { useState, useEffect,useRef } from "react";
import { io } from "socket.io-client";
import eyetest from "../assets/eyetest.png";
import fishing from "../assets/fishing.png";
import fruitseat from "../assets/fruitseat.png";
import icecream from "../assets/icecream.png";
import ipad from "../assets/ipad.png";
import oclass from "../assets/oclass.png";
import oclass2 from "../assets/oclass2.png";
import running from "../assets/running.png";
import school from "../assets/school.png";
import schoolbus from "../assets/schoolbus.png";
import angry from "../assets/emoji/angry.png";
import happy from "../assets/emoji/happy.png";
import sad from "../assets/emoji/sad.png";
import tired from "../assets/emoji/sleepy.png";
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
  const [selectedDay, setSelectedDay] = useState("Monday");
 const [items, setItems] = useState([
  { id: "happy", label: "Happy", image: happy },
  { id: "sad", label: "Sad", image: sad },
  { id: "angry", label: "Angry", image: angry },
  { id: "tired", label: "Tired", image: tired },

  { id: "eyetest", label: "Eye Test", image: eyetest },
  { id: "fishing", label: "Fishing", image: fishing },
  { id: "fruitseat", label: "Fruit Seat", image: fruitseat },
  { id: "icecream", label: "Ice Cream", image: icecream },

  { id: "ipad", label: "iPad", image: ipad },
  { id: "oclass", label: "Class", image: oclass },
  { id: "oclass2", label: "Class 2", image: oclass2 },
  { id: "running", label: "Running", image: running },

  { id: "school", label: "School", image: school },
  { id: "schoolbus", label: "School Bus", image: schoolbus },
].map((item, index) => ({
  ...item,
  isTemplate: true,

  // 4 columns
  x: 5 + (index % 6) * 15,

  // 3 rows
  y: 50 + Math.floor(index / 6) * 12,
 }))
);

  const sensors = useSensors(useSensor(PointerSensor));
 useEffect(() => {

      socket.emit("daySelected", selectedDay);

  }, [selectedDay]);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

  socket.on("itemCreated", (newItem) => {
  setItems((prev) => [...prev, newItem]);
});
 socket.on("itemMoved", (updatedItem) => {
          console.log("updatedItem:", updatedItem);

  setItems((prev) =>
    prev.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    )
  );
});
socket.on("daySelected", (data) => {
        console.log("Received daySelected", data);

      setSelectedDay(data);
    });
    return () => {
      socket.off("itemMoved");
            socket.off("daySelected");

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

  socket.emit("itemCreated", duplicate);

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

    socket.emit("itemMoved", updated);

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