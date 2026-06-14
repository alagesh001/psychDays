import { createContext, useContext, useState } from "react";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [roomIdGlobal, setRoomIdGlobal] = useState(null);

  return (
    <RoomContext.Provider value={{ roomIdGlobal, setRoomIdGlobal }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);