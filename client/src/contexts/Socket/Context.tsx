import { createContext, useContext } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');
const SocketContext = createContext({socket});

const SocketProvider = (props: any) => {
    return <SocketContext.Provider value={{socket}}  {...props} />
}

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;