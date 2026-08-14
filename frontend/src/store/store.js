import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        notifications: notificationReducer,
    },
});