"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const PORT = 4000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:8080",
    credentials: true,
}));
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
io.on("connection", () => {
    console.log("user connected");
});
app.listen(PORT, "server listening on port 4000");
//# sourceMappingURL=index.js.map