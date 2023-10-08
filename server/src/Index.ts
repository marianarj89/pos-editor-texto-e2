import { Server, Socket } from "socket.io";
import http from "http";
import Delta from "quill-delta";
import DocumentModel from "./Documento";

async function findOrCreateDocument(id: string) {
    // if (id == null) return

    const document = await DocumentModel.findOne({id: id});
    if (document) return document;
    const newDocument = await DocumentModel.create({
        id: id,
        data: {}});

    return newDocument;
}


const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket: Socket) => {
    socket.on("send-changes", (delta: Delta) => {
        socket.broadcast.emit("receive-changes", delta);
    })
    console.log("usuário conectado");
    socket.on("disconnect", () => {
        console.log("usuário desconectado");
    });
});

server.listen(3001, () => {
    console.log("Servidor conectado na porta 3001");
});
