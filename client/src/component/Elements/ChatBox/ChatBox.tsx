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
import defaultAvatar from '~/assets/default-avatar.png';
import { Avatar } from 'antd';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

const MessageSend = (message: string, username: string): JSX.Element => {
    return (
        <div className="chat-message">
            <div className="flex items-end justify-end">
                <div className="flex flex-col space-y-2 text-xs max-w-[250px] mx-2  items-end">
                    <div>
                        <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                            {message}
                        </span>
                    </div>
                </div>
                <Avatar size={24} style={{ fontSize: 20 }} src={defaultAvatar} />
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
                <Avatar size={24} style={{ fontSize: 20 }} src={defaultAvatar} />
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
    const [userChat, setUserChat] = React.useState<{ username?: string; fullname?: string }>({});

    React.useEffect(() => {
        requestApi('get', API_GET_USER, { id: userChatId }).then(res => {
            if (res.data.result) {
                const user = _.get(res.data.result, 'user.username', '');
                setUserChat({ username: user, fullname: _.get(res.data.result, 'user.fullName', '') });
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
        <div className="fixed right-3 bottom-2">
            <div className="flex-1 justify-between flex flex-col w-[300px] h-[450px] rounded-2xl overflow-hidden bg-white shadow">
                <div className="flex w-full items-center justify-between bg-[#ffba00] bg-opacity-60 py-1.5 px-3">
                    <div className="relative flex items-center">
                        <div className="relative">
                            <Avatar size={40} style={{ fontSize: 20 }} src={defaultAvatar} />
                        </div>
                        <div className="flex flex-col ml-2">
                            <div className="text-[16px] font-bold flex items-center">
                                <span className="text-gray-700 ">{userChat.fullname}</span>
                            </div>
                            <div className="flex items-center">
                                <span
                                    className={clsx('w-2 h-2 rounded-full bg-[#9b9b9b]')}
                                    style={{
                                        background: '#589f39',
                                    }}
                                />
                                <span className="text-[11px] text-[#9b9b9b] ml-1.5">Đang hoạt động</span>
                            </div>
                        </div>
                    </div>
                    <div
                        className="flex items-center justify-center w-8 h-8 duration-150 ease-in-out rounded-full cursor-pointer hover:bg-[white] hover:bg-opacity-30 "
                        onClick={onCloseClick}
                    >
                        <BaseIcon icon={faClose} size={'lg'} />
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
                                ? MessageSend(item.message, authUser?.user?.username ?? '')
                                : MessageReceive(item.message, userChat.username ?? '');
                        })}
                </div>
                <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
                    <div className="relative flex">
                        <input
                            ref={inputRef}
                            className="relative top-[-9px] w-full bg-[#3a3b3c] bg-opacity-40 placeholder:text-[#e4e6eb] py-2 px-4 rounded-[40px] text-[#e4e6eb] outline-none"
                            type="text"
                            name="message"
                            onKeyPress={event => {
                                if (event.key === 'Enter') {
                                    sendMessage();
                                }
                            }}
                            placeholder="Aa ..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ChatBox;
