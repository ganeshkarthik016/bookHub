import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useSocket } from '../hooks/useSocket';
import {
    notificationsStart,
    notificationsSuccess,
    setUnreadCount,
} from '../store/slices/notificationSlice';
import { getNotifications, getUnreadCount } from '../services/notification.service';

function MainLayout() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    useSocket();

    useEffect(() => {
        if (!isAuthenticated) return;

        const initializeNotifications = async () => {
            dispatch(notificationsStart());
            try {
                const [notifResponse, countResponse] =
                    await Promise.all([
                        getNotifications(1, 20),
                        getUnreadCount(),
                    ]);

                dispatch(
                    notificationsSuccess(
                        notifResponse.data || []
                    )
                );
                dispatch(
                    setUnreadCount(countResponse.data || 0)
                );
            } catch (error) {
                console.error(
                    'Failed to initialize notifications:',
                    error
                );
            }
        };

        initializeNotifications();
    }, [isAuthenticated, dispatch]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Navbar />

            <div className="flex min-h-[calc(100vh-4rem)]">
                <Sidebar />

                <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
