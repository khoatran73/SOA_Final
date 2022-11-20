import { Model, model, Schema } from 'mongoose';
import { DefaultModelId } from '../configs';

interface ChatMethod {}
export type IMessage = {
    userId: string;
    message: string;
};
export type IChat = {
    roomId: string;
    users: string[];
    message: IMessage[];
};
type ChatModel = Model<IChat, {}, ChatMethod>;

const schema = new Schema<IChat, ChatModel, ChatMethod>(
    {
        users: {type: [], required: true},
        roomId: { type: String, required: true},
        message: { type: [] },
    },
    { timestamps: true },
);

const Chat = model<IChat, ChatModel>('Chat', schema);

export default Chat;
