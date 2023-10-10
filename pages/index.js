import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";

let socket;

export default function CreateRoomPage() {
  const router = useRouter();

  const [Name, setName] = useState("Rony");

  useEffect(() => {
    (async () => {
      await fetch("/api/socket");
      socket = io();

      socket.on("connect", () => {
        console.log("connected");
      });

      socket.on("room-created", (roomId, user) => {
        localStorage.setItem("userNick", Name);
        router.push(`/${roomId}`);
      });
    })();
  }, []);

  function handleCreateRoom() {
    socket.emit("create-room");
  }

  return (
    <>
      <input className="border py-2 px-4" placeholder="Nickname" value={Name} onChange={(e) => setName(e.target.value)} />
      <button className="border bg-blue-400 rounded py-2 px-4 text-white" onClick={handleCreateRoom}>
        Create room
      </button>
    </>
  );
}
