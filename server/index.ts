import { createServer } from "http";
import express from "express";
import next, { NextApiHandler } from "next";
import { Server } from "socket.io";
import { Socket } from "socket.io-client";

// DECLARED IN GLOABL(-- BUG: NOT WORKING)

interface CtxOptions {
  lineWidth: number;
  lineColor: string;
}

interface Move {
  path: [number, number][];
  options: CtxOptions;
}

type Room = Map<string, Move[]>;

interface ServerToClientEvents {
  room: (room: string) => void;
  created: (roomId: string) => void;
  joined: (roomId: string, failed: boolean) => void;
  user_draw: (move: Move, userId: string) => void;
  user_undo(userId: string): void;
  mouse_moved: (x: number, y: number, userId: string) => void;
  new_user: (userId: string) => void;
  user_disconnected: (userId: string) => void;
}

interface ClientToServerEvents {
  draw: (move: Move) => void;
  mouse_move: (x: number, y: number) => void;
  undo: () => void;
  create_room: () => void;
  join_room: (room: string) => void;
  joined_room: () => void;
  leave_room: () => void;
}

// END

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app = express();
  const server = createServer(app);

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);

  app.get("/health", async (_, res) => {
    res.send("healthy");
  });

  const rooms = new Map<string, Room>();

  rooms.set("global", new Map());

  const addMove = (roomId: string, socketId: string, move: Move) => {
    const room = rooms.get(roomId);

    if (!room?.has(socketId)) {
      room?.set(socketId, [move]);
    }

    room?.get(socketId)?.push(move);
  };

  const undoMove = (roomId: string, socketId: string) => {
    const room = rooms.get(roomId);

    room?.get(socketId)?.pop();
  };

  io.on("connection", (socket: any) => {
    console.log("connection");
    console.log("SocketId : ", socket.id);

    const getRoomId = () => {
      const joinedRoom = [...socket.rooms].find((room) => room !== socket.id);

      if (!joinedRoom) return socket.id;

      return joinedRoom;
    };

    socket.on("create_room", () => {
      let roomId;

      do {
        roomId = Math.random().toString(36).substring(2, 6);
      } while (rooms.has(roomId));
      {
        socket.join(roomId);

        rooms.set(roomId, new Map());
        rooms.get(roomId)?.set(socket.id, []);

        io.to(socket.id).emit("created", roomId);
      }
    });

    socket.on("join_room", (roomId: string) => {
      if (rooms.has(roomId)) {
        socket.join(roomId);

        //true not there ?s
        io.to(socket.id).emit("joined", roomId, true);
      } else io.to(socket.id).emit("joined", "", true);
    });

    socket.on("joined_room", () => {
      console.log("Joined Room !");

      const roomId = getRoomId();

      rooms.get(roomId)?.set(socket.id, []);

      io.to(socket.id).emit("room", JSON.stringify([...rooms.get(roomId)!]));

      socket.broadcast.to(roomId).emit("new_user", socket.id);
    });

    socket.on("leave_room", () => {
      const roomId = getRoomId();

      const user = rooms.get(roomId)?.get(socket.id);

      if (user?.length === 0) rooms.get(roomId)?.delete(socket.id);
    });

    socket.on("draw", (move: Move) => {
      console.log("drawing");
      const roomId = getRoomId();
      addMove(roomId, socket.id, move);
      socket.broadcast.to(roomId).emit("user_draw", move, socket.id);
    });

    socket.on("undo", () => {
      console.log("undo");
      const roomId = getRoomId();
      undoMove(roomId, socket.id);
      socket.broadcast.to(roomId).emit("user_undo", socket.id);
    });

    socket.on("mouse_move", (x: number, y: number) => {
      console.log("Mouse move");
      socket.broadcast.to(getRoomId()).emit("mouse_moved", x, y, socket.id);
    });

    socket.on("disconnect", () => {
      io.to(getRoomId()).emit("user_disconnected", socket.id);
      const user = rooms.get(getRoomId())?.get(socket.id);

      if (user?.length === 0) rooms.get(getRoomId())?.delete(socket.id);

      console.log("client disconnected");
    });
  });

  app.all("*", (req: any, res: any) => nextHandler(req, res));

  server.listen(port, () =>
    console.log(`Server is ready. Listening on port:  ${port}`)
  );
});
