import { APP_API_PATH } from '~/configs';
import { IMessage } from '~/store/chatSlice';

export type ISocket = {
    roomId?: string;
    users: string[];
    message?: IMessage[];
}

export const GET_CHAT_DATA_API = APP_API_PATH + '/chat/get-chat';
export const GET_CHAT_LIST_DATA_API = APP_API_PATH + '/chat/get-chat-list';