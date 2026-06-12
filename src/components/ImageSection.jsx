import { useState,useEffect } from "react";
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
import { io } from "socket.io-client";

import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function DraggableCard({ item }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  });

  const style = {
    position: "absolute",
    left: item.x,
    top: item.y,
    transform: CSS.Translate.toString(transform),
    width: "180px",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
     
    >
      <div >
        <img
  src={item.image}
  alt={item.title}
   {...listeners}
      {...attributes}
  className="w-16 h-16 object-cover rounded-md mx-auto cursor-grab active:cursor-grabbing touch-none"
  draggable={false}
/>
        <p className="mt-1 text-center text-sm font-small">
          {item.title}
        </p>
      </div>
    </div>
  );
}

export default function ImageSection() {
 // const socket = io("https://oxadmedia.online");

// socket.on("connect", () => {
//   console.log("Connected:", socket.id);
// });
  const defaultItems =   [
  {
    id: "1",
    x: 0,
    y: 450,
    image: eyetest,
    title: "Vision therapy",
     isCopy: false,
  },
  {
    id: "2",
    x: 100,
    y: 450,
    image: fishing,
    title: "Fishing",
     isCopy: false,
  },
  {
    id: "3",
    x: 200,
    y: 450,
    image: fruitseat,
    title: "Eating Fruits",
     isCopy: false,
  },
  {
    id: "4",
    x: 300,
    y: 450,
    image: icecream,
    title: "Icecream",
     isCopy: false,
  },
  {
    id: "5",
    x: 400,
    y: 450,
    image: ipad,
    title: "Ipad Time",
     isCopy: false,
  },
  {
    id: "6",
    x: 500,
    y: 450,
    image: oclass,
    title: "Online Class 1",
     isCopy: false,
  },
   {
    id: "7",
    x: 0,
    y: 550,
    image: oclass2,
    title: "Online Class 2",
     isCopy: false,
  },
  {
    id: "8",
    x: 100,
    y: 550,
    image: running,
    title: "Run with Father",
     isCopy: false,
  },
  {
    id: "9",
    x: 200,
    y: 550,
    image: school,
    title: "School",
     isCopy: false,
  },
  {
    id: "10",
    x: 300,
    y: 550,
    image: schoolbus,
    title: "School Bus",
     isCopy: false,
  },
  {
    id: "11",
    x: 400, 
       y: 550,
    image: happy,
    title: "Happy",
     isCopy: false,
  },
  {
    id: "12",
    x: 500,
    y: 550,
    image: sad,
    title: "Sad",
     isCopy: false,
  },
  {
    id: "13",
    x: 600,
    y: 550,
    image: angry,
    title: "Angry",
     isCopy: false,
  },
  {
    id: "14",
    x: 600,
    y: 450,
    image: tired,
    title: "Tired",
     isCopy: false,
  },
];

const [items, setItems] = useState(() => {
  const saved = localStorage.getItem("drag-items");

  if (saved) {
    return JSON.parse(saved);
  }

  return defaultItems;
});
useEffect(() => {
  localStorage.setItem("drag-items", JSON.stringify(items));
}, [items]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  );
const resetPositions = () => {
  setItems(defaultItems);
  localStorage.removeItem("drag-items");
};
function handleDragEnd(event) {
  const { active, delta } = event;

  const item = items.find((i) => i.id === active.id);

  if (!item) return;

  // Original bottom items -> create copy
  if (!item.isCopy) {
    const duplicate = {
      ...item,
      id: crypto.randomUUID(),
      x: item.x + delta.x,
      y: item.y + delta.y,
      isCopy: true,
    };

    setItems((prev) => [...prev, duplicate]);
    //socket.emit("message", duplicate);
  }else {
  const movedItem = {
    id: active.id,
    x: item.x + delta.x,
    y: item.y + delta.y,
  };

  setItems((prev) =>
    prev.map((i) =>
      i.id === active.id
        ? {
            ...i,
            x: movedItem.x,
            y: movedItem.y,
          }
        : i
    )
  );

 // socket.emit("itemMoved", movedItem);
}
  
}

return (
  <div className="mt-3">

    {/* <h2 className="text-xl font-bold mb-4">
      Drag & Drop Activities
    </h2> */}

    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
        {items.map((item) => (
          <DraggableCard key={item.id} item={item} />
        ))}
    
    </DndContext>

      <button
  onClick={resetPositions}
  className="relative mt-50 z-50 bg-blue-500 text-white px-4 py-2 rounded"
>
  Reset Layout
</button>
  </div>
);
}