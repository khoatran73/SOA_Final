import _ from 'lodash';
import * as React from 'react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/AppStore';
import { API_GET_USER } from '~/configs';
import { useSocket } from '~/contexts/Socket/Context';
import { requestApi } from '~/lib/axios';
import { chatSlice, fetchMessage } from '~/store/chatSlice';
import './chatbox.scss';

const MessageSend = (message: string,username: string): JSX.Element => {
    return (
        <div className="chat-message">
            <div className="flex items-end justify-end">
                <div className="flex flex-col space-y-2 text-xs max-w-[250px] mx-2 order-1 items-end">
                    <div>
                        <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                            {message}
                        </span>
                    </div>
                </div>
                <div className="w-6 h-6 order-2 bg-blue-700 rounded-full text-white font-semibold flex items-center justify-center ml-1">
                    {username.charAt(0).toUpperCase()}
                </div>
            </div>
        </div>
    );
};
const MessageReceive = (message: string, username: string): JSX.Element => {
    return (
        <div className="chat-message">
            <div className="flex items-end">
                <div className="flex flex-col space-y-2 text-xs max-w-[250px] mx-2 order-2 items-start">
                    <div>
                        <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                            {message}
                        </span>
                    </div>
                </div>
                <div className="w-6 h-6 order-1 bg-blue-700 rounded-full text-white font-semibold flex items-center justify-center ml-1">
                    {username.charAt(0).toUpperCase()}
                </div>
            </div>
        </div>
    );
};
const ChatBox: React.FC = (props: any) => {
    const { isShow, data, message, userChatId } = useSelector((state: RootState) => state.chat);
    const { authUser } = useSelector((state: RootState) => state.authData);
    const inputRef = useRef<any>(null);
    const { setShowChat, setNewMessage } = chatSlice.actions;
    const dispatch = useDispatch();
    const { socket } = useSocket();
    const [userChat, setUserChat] = React.useState<{username?:string,fullname?:string}>({});

    React.useEffect(() => {
        requestApi('get', API_GET_USER, { id: userChatId }).then(res => {
            if (res.data.result) {
                const user = _.get(res.data.result, 'user.username', '');
                setUserChat({username:user,fullname:_.get(res.data.result, 'user.fullName', '')});
            }
        });
        dispatch(fetchMessage(_.get(data, 'users')));
        socket.on('receive_message', (data: any) => {
            dispatch(setNewMessage(data));
        });
        return () => {
            socket.off('receive_message');
        };
    }, []);

    const onCloseClick = () => {
        dispatch(setShowChat({ isShow: !isShow, userChatId: '' }));
    };
    const sendMessage = () => {
        const input = inputRef.current?.value;
        if (input !== '') {
            socket.emit('join_room', data);
            socket.emit('send_message', { ...data, message: { userId: authUser?.user.id, message: input } });
            inputRef.current.value = '';
        }
    };
    return (
        <div className="chat_box-container fixed right-2 bottom-2">
            <div className="flex-1 justify-between flex flex-col w-[400px] h-[550px]">
                <div className="chat_box-header flex sm:items-center justify-between py-3 border-b-2 ">
                    <div className="relative flex items-center space-x-4">
                        <div className="relative">
                            <span className="absolute text-green-500 right-0 bottom-0">
                                <svg width="20" height="20">
                                    <circle cx="8" cy="8" r="8" fill="currentColor" />
                                </svg>
                            </span>
                            <div className="h-12 w-12 p-2 bg-blue-700 rounded-full text-white font-semibold flex items-center justify-center ml-1">
                                {userChat.username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div className="flex flex-col leading-tight">
                            <div className="text-[19px] mt-1 flex items-center">
                                 <span className="text-gray-700 mr-3">{userChat.fullname}</span>
                            </div>
                            <span className="text-sm text-gray-600">Hoạt động vài phút trước</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            className="mr-1 inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                            onClick={onCloseClick}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div
                    id="messages"
                    className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                >
                    {message &&
                        message.length > 0 &&
                        message.map((item: any, index: number) => {
                            return item.userId === authUser?.user.id
                                ? MessageSend(item.message,authUser?.user?.username ?? '')
                                : MessageReceive(item.message,userChat.username ?? '');
                        })}
                </div>
                <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
                    <div className="relative flex">
                        <input
                            ref={inputRef}
                            type="text"
                            name="message"
                            placeholder="Write your message!"
                            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
                        />
                        <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                                onClick={sendMessage}
                            >
                                <span className="font-bold">Send</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-5 w-5 ml-2 transform rotate-90"
                                >
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ChatBox;
