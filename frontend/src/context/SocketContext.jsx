import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import conf from "../conf/conf";

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user: currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        if (currentUser) {
            const socketInstance = io(conf.socketIOURL, {
                query: {
                    userId: currentUser._id,
                },
            });

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSocket(socketInstance);

            socketInstance.emit("register", currentUser._id);

            return () => {
                socketInstance.disconnect();
            };
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [currentUser]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};