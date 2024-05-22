"use client";
import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";
import { socket } from "../../../common/lib/socket";

const Home = () => {
  const [roomId, setRoomId] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    socket.on("created", (roomIdFromServer) => {
      router.push(roomIdFromServer);
    });

    socket.on("joined", (roomIdFromServer, failed) => {
      if (!failed) router.push(roomIdFromServer);
      else console.log("Failed to join the Room !");
    });

    return () => {
      socket.off("created");
      socket.off("joined");
    };
  }, [router]);

  // CREATE ROOM
  const handleCreateRoom = () => {
    socket.emit("create_room");
  };

  // JOIN ROOM
  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("join_room", roomId);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-5xl font-extrabold leading-tight sm:text-extra">
        Digiboard
      </h1>

      <h3 className="text-2xl">Real-Time Whiteboard</h3>

      <form
        className="flex flex-col items-center gap-3"
        onSubmit={handleJoinRoom}
      >
        <label htmlFor="room-id" className="self-start font-bold leading-tight">
          Enter room id
        </label>
        <input
          className="input"
          id="room-id"
          placeholder="Room id..."
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button className="btn" type="submit">
          Join
        </button>
      </form>

      <div className="my-8 flex w-96 items-center gap-2">
        <div className="h-px w-full bg-zinc-200" />
        <p className="text-zinc-400">or</p>
        <div className="h-px w-full bg-zinc-200" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h5 className="self-start font-bold leading-tight">Create new room</h5>

        <button className="btn" onClick={handleCreateRoom}>
          Create
        </button>
      </div>
    </div>
  );
};

export default Home;
