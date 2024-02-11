import { Socket } from "socket.io";
import { v4 as uuvidV4 } from "uuid";

const rooms: Record<string, string[]> = {};

interface IRoomParams {
    roomId: string;
    peerId: string;
};

export const handler = (socket: Socket) => {
    const createRoom = () => {
        const roomId = uuvidV4();
        rooms[roomId] = [];
        socket.emit("room-created", { roomId });
        console.log("user created a room");
    };
    
    const joinRoom = ({ roomId, peerId } : IRoomParams) => {
        if (rooms[roomId] && !rooms[roomId].includes(peerId)) {
            socket.join(roomId);
            rooms[roomId].push(peerId);
            console.log("user joined room: " + roomId);
            socket.to(roomId).emit("user-joined", {peerId});
            socket.emit("get-users", {
                roomId,
                participants: rooms[roomId],
            });
        };

        socket.on("disconnect", () => {
            console.log("user left the room: " + peerId);
            leaveRoom({roomId, peerId});
        })
    };

    const leaveRoom = ({peerId, roomId}: IRoomParams) => {
        if (rooms[roomId]) {
            rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
            socket.to(roomId).emit("user-disconneted", peerId);
        }
    }

    const getRooms = () => {
        socket.emit("rooms", { rooms });
    };

    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
    socket.on("get-rooms", getRooms);
};