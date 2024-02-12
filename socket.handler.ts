import { Socket } from "socket.io";
import { v4 as uuvidV4 } from "uuid";

const rooms: Record<string, [string, string][]> = {};

interface IRoomParams {
    roomId: string;
    peerId: string;
    peerName: string;
};

export const handler = (socket: Socket) => {
    const createRoom = () => {
        const roomId = uuvidV4();
        rooms[roomId] = [];
        socket.emit("room-created", { roomId });
        console.log("user created a room");
    };
    
    const joinRoom = ({ roomId, peerId, peerName } : IRoomParams) => {
        if (rooms[roomId] && !rooms[roomId].map(room => room[0]).includes(peerId)) {
            socket.join(roomId);
            rooms[roomId].push([peerId, peerName]);
            console.log(peerName + " joined room: " + roomId);
            socket.to(roomId).emit("user-joined", {peerId, peerName});
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

    const leaveRoom = ({peerId, roomId}: Omit<IRoomParams, "peerName">) => {
        if (rooms[roomId]) {
            rooms[roomId] = rooms[roomId].filter((peer) => peer[0] !== peerId);
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