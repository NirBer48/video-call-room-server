import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import express, { Application } from "express";
import { handler } from "./socket.handler";

const PORT = 4000;
const app: Application = express();

app.use(
    cors({
        origin: "http://10.100.11.131:8080",
        credentials: true,
    })
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("A user connected");

    handler(socket);

    io.on("disconnect", () => {
        console.log("A user disconnected");
    })
});

httpServer.listen(PORT, "10.100.11.131" || "localhost", () => {
    console.log("server listening on port 4000")
});
