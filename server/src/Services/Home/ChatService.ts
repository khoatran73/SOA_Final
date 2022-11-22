import { Request, Response } from 'express';
import User from '../../Models/User';
import { ResponseFail } from '../../common/ApiResponse';
import { ResponseOk } from '../../common/ApiResponse';
import Chat, { IChat } from '../../Models/Chat';

export const getChatData = async(req: Request, res: Response) =>{
    const users = req.query.users;
    const chat = await Chat.findOne({users: {$all: users}});
    if (!Boolean(chat)) return res.json(ResponseFail());
    return res.json(ResponseOk(chat ?? {} as IChat))
}
export const getChatListUser = async(req: Request, res: Response) =>{
    const {id} = req.query
    const chats = await Chat.find({users: {$all: [id]}})
    const userChats = await User.find();
    const result = chats.map(chat => {
        const user = userChats.find((x) => x.id === chat.users[0])
        return {
            id: user?.id,
            name: user?.fullName,
            username: user?.username,
            lastMessage: chat.message[chat.message.length - 1]
        }
    })
    return res.json(ResponseOk(result))
}

const ChatService = {
    getChatData,
    getChatListUser
}

export default ChatService; 