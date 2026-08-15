import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import Playlists from "./pages/Playlists";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import MainLayout from "./components/layout/MainLayout.jsx";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

import { getCurrentUser } from "./services/auth.service";
import { restoreUser, loginFailure } from "./store/slices/authSlice";
import { addNotification, notificationsSuccess, setUnreadCount } from "./store/slices/notificationSlice";
import { getNotifications, getUnreadCount } from "./services/notification.service";
import socket from "./services/socket";

function App() {
    const dispatch = useDispatch();

    const authChecked = useSelector(
        (state) => state.auth.authChecked
    );
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await getCurrentUser();

                dispatch(
                    restoreUser(response.data)
                );
            } catch {
                dispatch(loginFailure());
            }
        };

        restoreSession();
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated || !user?._id) return undefined;

        const loadNotifications = async () => {
            try {
                const [listResponse, countResponse] = await Promise.all([getNotifications(1, 20), getUnreadCount()]);
                dispatch(notificationsSuccess(listResponse.data.data));
                dispatch(setUnreadCount(countResponse.data.data.count));
            } catch {
                // Notifications are supplementary; the authenticated app remains usable if unavailable.
            }
        };
        loadNotifications();
        socket.connect();
        socket.emit("register", user._id);
        const onNotification = (notification) => dispatch(addNotification(notification));
        socket.on("new_notification", onNotification);

        return () => {
            socket.off("new_notification", onNotification);
            socket.disconnect();
        };
    }, [dispatch, isAuthenticated, user?._id]);

    if (!authChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />

                {/* Wrap MainLayout with ProtectedRoute, and nest your pages inside */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Home />} />
                    <Route path="notes" element={<Notes />} />
                    <Route path="playlists" element={<Playlists />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
