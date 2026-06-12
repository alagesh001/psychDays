import { useState, useEffect } from "react";
import ImageSection from "../components/ImageSection.jsx";


export default function Table() {

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

  return (
<div className="min-h-screen  p-1">
    {isPortrait && (
  <div className="fixed inset-0 bg-white z-50">
    <div className="w-full text-center pt-8">
      <h1 className="text-2xl font-bold">
        Please rotate your device to landscape mode
      </h1>
    </div>
  </div>
)}

    <div className="max-w-7xl mx-auto ">
  <div className="overflow-x-auto">
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
     className={`w-[14.28%] border border-gray-300 py-2 text-center cursor-pointer
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
                    className={`border border-gray-300 h-24 md:h-32 lg:h-30 cursor-pointer transition-all
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
        </div>
      </div>
<ImageSection />
      {/* <div className="mt-6 text-center text-lg font-semibold">
        Selected Day: <span className="text-blue-600">{selectedDay}</span>
      </div> */}
    </div>
  );
}