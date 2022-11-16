import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';
import dotenv from 'dotenv';
import Chat, { IMessage } from './Models/Chat';
dotenv.config();

export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;
    public users: { [uid: string]: string };
    constructor(server: HttpServer) {
        ServerSocket.instance = this;
        this.users = {};
        this.io = new Server(server, {
            serveClient: false,
            pingTimeout: 5000,
            pingInterval: 10000, 
            cookie: false,
            cors: {
                origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
            },
        });
        this.io.on('connection', this.StartListener);
        console.info('ServerSocket started');
    }

    StartListener = (socket: Socket) => {
        socket.on('join_room', ({ roomId }) => {
            socket.join(roomId);
        });
        socket.on('send_message', data => {
            const { message, users, roomId } = data;
            this.io.to(roomId).emit('receive_message', message);
            this.handleSaveMessage(roomId, users, message);
        });
        socket.on('disconnect', () => {
            console.log('disconnect');
        });
    };
    handleSaveMessage = async (roomId: string, users: string[], message: IMessage) => {
        const chat = await Chat.findOne({ roomId, users: { $all: users } });
        if (chat) {
            chat.message.push({ ...message });
            return await chat.save();
        }
        const newChat = new Chat({
            roomId, 
            users,
            message: [{ ...message }],
        });
        return await newChat.save();
    };
}
