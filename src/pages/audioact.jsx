import { useEffect,useRef, useState } from "react";
import { socket } from "../components/socketget";
import { useRoom } from "../components/roomprovider";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  DndContext,
  useDraggable,
} from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";
const API_BASE = "https://oxadmedia.online/api";
const IMAGE_URL =
  "https://oxadmedia.online/api/fetchimg/handpointer.webp";


const IMG_SIZE = 80;


export default function AudioActivityViewer() {
  const [CANVAS_HEIGHT, setCanvasHeight] = useState(1000);

  const imageRef = useRef(null);

      const { roomIdGlobal } = useRoom();
const [roomId, setRoomId] = useState(roomIdGlobal);

  const [data, setData] = useState(null);
// useEffect(() => {

//   function updateHeight() {

//     if (imageRef.current) {

//       const imgHeight =
//         imageRef.current.getBoundingClientRect().height;


//       setCanvasHeight(imgHeight);
//       console.log("height of canvas ",imgHeight)
//     }

//   }


//   updateHeight();

//   window.addEventListener("resize", updateHeight);


//   return () => {
//     window.removeEventListener("resize", updateHeight);
//   };

// }, [data]);
function DraggableImage({ position }) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: "hand-pointer",
  });


  const x =
    (position.x / 100) * (window.innerWidth - IMG_SIZE);

  const y =
    (position.y / 100) * (CANVAS_HEIGHT - IMG_SIZE);



  const style = {
    transform: CSS.Translate.toString({

      x: x + (transform?.x ?? 0),
      y: y + (transform?.y ?? 0),
      zIndex:9999

    }),
  };


  return (
    <img
      ref={setNodeRef}

      src={IMAGE_URL}

      {...listeners}
      {...attributes}

      style={style}

      className="
        absolute
        w-20
        h-20
        cursor-grab
        active:cursor-grabbing
        touch-none
        select-none
      "
    />
  );
}
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

useEffect(() => {

  const onItemMoved = (data) => {
//console.log("recesss",data);
     setPosition({
    x: data.x,
    y: data.y
  });

  };


  socket.on("pointerMoved", onItemMoved);


  return () => {

    socket.off("pointerMoved", onItemMoved);

  };

}, []);
const playAudio = (pointerId,pointerAudio) => {
  audioPlayer.pause();

  audioPlayer.src = pointerAudio;

  audioPlayer.currentTime = 0;
  audioPlayer.play();
};
  const [position,setPosition] = useState({
    x:20,
    y:20
  });
const boardRef = useRef(null);

function handleDragEnd(event) {

  const delta = event.delta;

  const rect = boardRef.current.getBoundingClientRect();

  const maxX = rect.width - IMG_SIZE;
  const maxY = CANVAS_HEIGHT ;


  const currentX =
    (position.x / 100) * maxX;

  const currentY =
    (position.y / 100) * maxY;
//console.log("cekcka",currentY);



  const newX = clamp(
    currentX + delta.x,
    0,
    maxX
  );


  const newY = clamp(
    currentY + delta.y,
    0,
    maxY
  );



  const newXPercent =
    (newX / maxX) * 100;


  const newYPercent =
    (newY / maxY) * 100;

console.log("cekcka",newYPercent);


  setPosition({
    x: newXPercent,
    y: newYPercent,
  });



  socket.emit("pointerMoved", {
    roomId,
    data: {
      x: newXPercent,
      y: newYPercent,
    }
  });

}

  function clamp(v,min,max){
    return Math.min(
      Math.max(v,min),
      max
    );
  }

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
<div
 ref={boardRef}
  className="
    relative
    bg-gray-100
    mx-auto
  "
  style={{
    height: CANVAS_HEIGHT,
  }}
>
  {isPortrait && (
    <div className="fixed inset-0 bg-white z-50">
      <div className="w-full text-center pt-8">
        <h1 className="text-2xl font-bold">
          Please rotate your device to landscape mode
        </h1>
      </div>
    </div>
  )}


  <DndContext

    onDragEnd={handleDragEnd}

    
  >


    {/* Main image */}
    <div className="relative mx-auto z-0">

      <img
      ref ={imageRef}
        src={`${API_BASE}/data/image.webp?v=${Date.now()}`}
         onLoad={() => {
    const imgHeight = imageRef.current.getBoundingClientRect().height;
    setCanvasHeight(imgHeight);
    console.log("height of canvas", imgHeight);
  }}
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
          onClick={() =>
            playAudio(pointer.id, pointer.audio)
          }
          className="
            absolute
            w-8
            h-8
            rounded-full
            bg-red-500
            text-white
            flex
            items-center
            justify-center
            text-sm
            font-bold
            -translate-x-1/2
            -translate-y-1/2
            cursor-pointer
          "
          style={{
            left: `${50 + pointer.xPercent / 2}%`,
            top: `${pointer.yPercent}%`,
          }}
        >
          {pointer.id}
        </div>
      ))}

    </div>



    {/* Drag layer */}
  <div
  className="
    absolute
    inset-0
    pointer-events-none
    z-[9999]
  "
>
  <div className="pointer-events-auto">

    <DraggableImage
      position={position}
    />

  </div>
</div>


  </DndContext>


</div>
  );
}