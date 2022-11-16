import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { AppThunk } from '~/AppStore';
import { requestApi } from '~/lib/axios';
import { GET_CHAT_DATA_API, ISocket } from '../contexts/Socket/Type';
interface ChatSliceProps {
    isShow: boolean;
    data?: ISocket | {};
    message: IMessage[];
    userChatId?: string;
}
export type IMessage = {
    userId: string;
    message: string;
};

const initialState: ChatSliceProps = {
    isShow: false,
    data: {} as ISocket,
    message: [],
};
export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setShowChat: (state, action: PayloadAction<{isShow:boolean,userChatId: string}>) => {
            return {
                ...state,
                isShow: action.payload.isShow,
                userChatId: action.payload.userChatId
            };
        },
        sendMessage: (state, action: PayloadAction<ISocket>) => {
            const message = action.payload.message ?? [];
            return {
                ...state,
                data: action.payload,
                message: [...message],
            };
        },
        setMessageList: (state, action: PayloadAction<IMessage[]>) => {
            return {
                ...state,
                message: [...action.payload],
            };
        },
        setNewMessage: (state, action: PayloadAction<IMessage[]>) => {
            const newMessageList = [...state.message, action.payload] as IMessage[];
            return {
                ...state,
                message: [...newMessageList],
            };
        },
    },
});
export const { setMessageList, sendMessage, setShowChat,setNewMessage} = chatSlice.actions;
export const fetchMessage = (users: string[] = []): AppThunk => async dispatch => {
    try {
        const response = await requestApi('get', GET_CHAT_DATA_API, { users });
        if (response.data?.success) {
            console.log(response.data)
            const roomId = _.get(response.data, 'result.roomId');
            const users = [_.get(response.data, 'result.hostId'),_.get(response.data, 'result.guestId')]
            const messageList: IMessage[] = _.get(response.data, 'result.message', []);
            const newData: ISocket = {
                roomId,
                users,
                message: messageList,
            }
            dispatch(sendMessage(newData));
        }
    } catch (err) {
        console.error(err);
    } finally {
    }
};
