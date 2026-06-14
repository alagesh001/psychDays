import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
} from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";


const IMAGE_URL =
  "https://oxadmedia.online/api/fetchimg/handpointer.webp";


const IMG_SIZE = 80;
const CANVAS_HEIGHT = 500;



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



export default function DragImage() {


  const [position,setPosition] = useState({
    x:20,
    y:20
  });



  function clamp(v,min,max){
    return Math.min(
      Math.max(v,min),
      max
    );
  }



  return (

    <DndContext

      onDragEnd={(event)=>{


        const delta = event.delta;


        const maxX =
          window.innerWidth - IMG_SIZE;

        const maxY =
          CANVAS_HEIGHT - IMG_SIZE;



        const currentX =
          (position.x / 100) * maxX;

        const currentY =
          (position.y / 100) * maxY;



        const newX =
          clamp(
            currentX + delta.x,
            0,
            maxX
          );


        const newY =
          clamp(
            currentY + delta.y,
            0,
            maxY
          );



        setPosition({

          x: (newX / maxX) * 100,

          y: (newY / maxY) * 100,

        });


      }}

    >

      <div
        className="
          relative
          w-screen
          h-[500px]
          overflow-hidden
          bg-gray-100
        "
      >

        <DraggableImage
          position={position}
        />


      </div>


    </DndContext>

  );
}