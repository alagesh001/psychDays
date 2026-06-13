import { useState } from "react";

export default function FullWidthImage() {
  const [image, setImage] = useState(null);
  const [widthPercent, setWidthPercent] = useState(100);
 const [pointers, setPointers] = useState([]);
  const [isAddingPointer, setIsAddingPointer] = useState(false);
const [isRecording, setIsRecording] = useState(false);
  // Stores only the distances
  const [pointerDistances, setPointerDistances] = useState([]);
  const [selectedPointer, setSelectedPointer] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(20);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const API_BASE = "https://oxadmedia.online/api";


  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
      setPointers([]);
      setPointerDistances([]);

       const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `${API_BASE}/upload-audio/uploadpic/image.webp`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
   if (data.success) {
       console.log("success uploaded");

  }
    }
  };
  const saveData = async () => {
  try {
    const res = await fetch(
      `${API_BASE}/upload-audio/s/save-data`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          widthPercent,
          pointers,
        }),
      }
    );

    const data = await res.json();

    console.log(data);
    alert("Saved");
  } catch (err) {
    console.error(err);
    alert("Save failed");
  }
};
 const recordAudioForPointer = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    const chunks = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

 recorder.onstop = async () => {
  const audioBlob = new Blob(chunks, {
    type: "audio/webm",
  });

  try {
    const filename = `recording${selectedPointer}`;

    const formData = new FormData();
    formData.append(
      "audio",
      audioBlob,
      `${filename}.webm`
    );

   const response = await fetch(
  `${API_BASE}/upload-audio/${filename}`,
  {
    method: "POST",
    body: formData,
  }
);

    const result = await response.json();

    setPointers((prev) =>
      prev.map((p) =>
        p.id === selectedPointer
          ? {
              ...p,
              audio: `${API_BASE}/data/${result.filename}`, // stored filename on server
            }
          : p
      )
    );
  } catch (err) {
    console.error("Upload failed", err);
  }

  stream.getTracks().forEach((track) =>
    track.stop()
  );

  setMediaRecorder(null);
  setIsRecording(false);
};

    recorder.start();
    setIsRecording(true);

    setTimeout(() => {
      if (recorder.state === "recording") {
        recorder.stop();
      }
    }, 20000);
  } catch (err) {
    console.error(err);
    alert("Microphone permission denied");
  }
};
const stopRecording = () => {
  if (
    mediaRecorder &&
    mediaRecorder.state === "recording"
  ) {
    mediaRecorder.stop();
  }
};
  const handleAddPointer = () => {
    if (pointers.length >= 5) return;
    setIsAddingPointer(true);
  };
 const handleImageClick = (e) => {
    if (!isAddingPointer) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  const yPercent = (y / rect.height) * 100;
    const absoluteX = e.clientX;

const imageCenterX = rect.width / 2;

const xPercent =
  ((x - imageCenterX) / imageCenterX) * 100;
    

 const usedIds = pointers.map((p) => p.id);

const nextId = [1, 2, 3, 4, 5].find(
  (id) => !usedIds.includes(id)
);

const newPointer = {
  id: nextId,
  x,
  y,
  xPercent,
  yPercent
};

    setPointers((prev) => [...prev, newPointer]);

    setPointerDistances((prev) => [
      ...prev,
      xPercent,yPercent
    ]);

    setIsAddingPointer(false);
  };
  const increaseSize = () => {
    setWidthPercent((prev) => Math.min(100, prev + 10));
  };

  const decreaseSize = () => {
    setWidthPercent((prev) => Math.max(10, prev - 10));
  };

  return (
    <div className="w-screen min-h-screen bg-gray-100">
      <div className="p-4 flex items-center gap-2">
        <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
          Add Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        {image && (
          <>
          <button
  onClick={saveData}
  className="px-4 py-2 bg-blue-500 text-white rounded"
>
  Save
</button>
            <button
              onClick={decreaseSize}
              className="px-3 py-2 bg-red-500 text-white rounded"
            >
              -
            </button>

            <span className="font-medium">{widthPercent}%</span>

            <button
              onClick={increaseSize}
              className="px-3 py-2 bg-green-500 text-white rounded"
            >
              +
            </button>
          </>
        )}
{image && (
  <>
    {pointers.length < 5 && (
      <button
        onClick={handleAddPointer}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Add Pointer
      </button>
    )}

    {pointers.length > 0 && (
      <button
        onClick={() => {
          setPointers([]);
          setPointerDistances([]);
          setSelectedPointer(null);
        }}
        className="px-4 py-2 bg-red-500 text-white rounded ml-2"
      >
        Clear All Pointers
      </button>
    )}
  </>
)}
      </div>

      {image && (
        <div
          className="relative"
          onClick={handleImageClick}
        >
          <img
            src={image}
            alt=""
            className="h-auto block mx-auto"
             style={{
            width: `${widthPercent}%`,
            maxWidth: "100vw", // never exceed screen width
          }}
          />
{selectedPointer && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <div className="bg-white rounded p-4 flex flex-col gap-2 min-w-[220px]">
      {(() => {
        const pointer = pointers.find(
          (p) => p.id === selectedPointer
        );

        return (
          <>
   

{isRecording ? (
  <button
    className="px-3 py-2 bg-orange-500 text-white rounded"
    onClick={stopRecording}
  >
    Stop Recording
  </button>
) : !pointer?.audio ? (
  <button
    className="px-3 py-2 bg-blue-500 text-white rounded"
    onClick={recordAudioForPointer}
  >
    Record Audio
  </button>
) : (
  <>
    <audio controls src={pointer.audio} className="w-full" />

    <button
      className="px-3 py-2 bg-blue-500 text-white rounded"
      onClick={recordAudioForPointer}
    >
      Record New Audio
    </button>
  </>
)}

            {/* <button
              className="px-3 py-2 bg-red-500 text-white rounded"
              onClick={() => {
                setPointers((prev) =>
                  prev.filter(
                    (p) => p.id !== selectedPointer
                  )
                );

                setSelectedPointer(null);
              }}
            >
              Remove Pointer
            </button> */}

            <button
              className="px-3 py-2 bg-gray-300 rounded"
              onClick={() => setSelectedPointer(null)}
            >
              Cancel
            </button>
          </>
        );
      })()}
    </div>
  </div>
)}
       {pointers.map((pointer, index) => (
  <div
    key={pointer.id}
    onClick={(e) => {
      e.stopPropagation();
      setSelectedPointer(pointer.id);
    }}
    className="absolute w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold -translate-x-1/2 -translate-y-1/2 cursor-pointer"
    style={{
      left: pointer.x,
      top: pointer.y,
    }}
  >
    {index + 1}
  </div>
))}
        </div>
      )}

      {/* <div className="p-4">
        <h2 className="font-bold mb-2">
          Stored Distances
        </h2>

        <pre>
          {JSON.stringify(pointerDistances, null, 2)}
        </pre>
        
      </div> */}

    
    </div>
  );
}