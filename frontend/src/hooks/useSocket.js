import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../services/socket";
import {
    addNotification,
    setUnreadCount,
} from "../store/slices/notificationSlice";

export const useSocket = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (!user) return;

        socket.connect();

        socket.emit("register", user._id);

        socket.on("new_notification", (notification) => {
            dispatch(addNotification(notification));
        });

        return () => {
            socket.off("new_notification");
        };
    }, [user, dispatch]);
};
