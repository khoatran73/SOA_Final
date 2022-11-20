import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/AppStore';
import { useSocket } from '~/contexts/Socket/Context';
import { GET_CHAT_DATA_API, GET_CHAT_LIST_DATA_API } from '~/contexts/Socket/Type';
import { requestApi } from '~/lib/axios';
import { chatSlice, fetchMessage, IMessage, setNewMessage } from '~/store/chatSlice';
const ChatView: React.FC = (props: any) => {
    const { authUser } = useSelector((state: RootState) => state.authData);
    const { data, message } = useSelector((state: RootState) => state.chat);
    const inputRef = useRef<any>(null);
    const { sendMessage } = chatSlice.actions;
    const dispatch = useDispatch();
    const { socket } = useSocket();
    const [listMessageUser, setListMessageUser] = useState<any>([]);
    const [indexActiveUserChat, setIndexActiveUserChat] = useState<{ username: string; index: number }>({
        username: '',
        index: 0,
    });
    useEffect(() => {
        const userId = authUser?.user.id;

        requestApi('get', GET_CHAT_LIST_DATA_API, { id: userId }).then(res => {
            if (res.data.success) {
                setListMessageUser(res.data.result);
            }
        });
        dispatch(fetchMessage([userId, listMessageUser[indexActiveUserChat.index]?.id]));
        socket.on('receive_message', (data: any) => {
            dispatch(setNewMessage(data));
        });
        return () => {
            socket.off('receive_message');
        };
    }, []);

    const onChatUser = async (item: any, index: number) => {
        setIndexActiveUserChat({ username: item.username, index: index });
        const chatMessage = await requestApi(
            'get',
            GET_CHAT_DATA_API,
            { users: [authUser?.user?.id ?? '', item?.id.toString() ?? ''] },
            {},
        );
        if (chatMessage.data?.success) {
            const messageList: IMessage[] = _.get(chatMessage.data, 'result.message', []);
            const roomId = _.get(chatMessage.data, 'result.roomId', '');
            dispatch(
                sendMessage({
                    roomId,
                    users: [authUser?.user?.id ?? '', item?.id.toString() ?? ''],
                    message: messageList,
                }),
            );
        } else {
            dispatch(
                sendMessage({
                    roomId: Math.random().toString(36).substring(7),
                    users: [authUser?.user?.id ?? '', item.id.toString() ?? ''],
                }),
            );
        }
    };

    const onChat = (e: any) => {
        e.preventDefault();
        const input = inputRef.current?.value;
        console.log(data);
        if (input !== '') {
            socket.emit('join_room', data);
            socket.emit('send_message', { ...data, message: { userId: authUser?.user.id, message: input } });
            inputRef.current.value = '';
        }
    };

    return (
        <div className="container mx-auto my-auto shadow-lg rounded-lg">
            <div className="flex flex-row justify-between bg-white">
                <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
                    {listMessageUser.map((item: any, index: number) => {
                        return (
                            <div
                                key={index}
                                className={`flex flex-row py-4 px-2 items-center border-b-2 ${
                                    indexActiveUserChat.index === index ? 'border-l-4 border-blue-400' : ''
                                }`}
                                onClick={() => onChatUser(item, index)}
                            >
                                <div className="w-1/4">
                                    <div className="p-2 mr-2 h-12 w-12 bg-blue-700 rounded-full text-white font-semibold flex items-center justify-center ml-1">
                                        {item.username?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="text-lg font-semibold">{item.name}</div>
                                    <span className="text-gray-500">{item.lastMessage.message}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="w-full px-5 flex flex-col justify-between">
                    <div className=" h-[500px] overflow-auto flex flex-col mt-5 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                        {message &&
                            message.length > 0 &&
                            message.map((item: any, index: number) => {                                
                                if (item.userId === authUser?.user.id) {
                                    return (
                                        <div key={index} className="flex justify-end mb-4">
                                            <div className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                                                {item.message}
                                            </div>
                                            <div className="p-2 mr-2 h-8 w-8 bg-blue-700 rounded-full text-white font-semibold flex items-center justify-center ml-1">
                                                {authUser?.user.username.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={index} className="flex justify-start mb-4">
                                            <div className="p-2 mr-2 h-8 w-8 bg-blue-700 rounded-full text-white font-semibold flex items-center justify-center ml-1">
                                                {indexActiveUserChat.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                                                {item.message}
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                    </div>
                    <form onSubmit={onChat} className="py-5">
                        <input
                            ref={inputRef}
                            name="message"
                            className="w-full bg-gray-300 py-5 px-3 rounded-xl outline-none"
                            type="text"
                            placeholder="type your message here..."
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatView;
