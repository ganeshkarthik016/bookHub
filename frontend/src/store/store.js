import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import notificationReducer from "./slices/notificationSlice.js";

export const store = configureStore({
    reducer: {
        auth : authReducer,
        notification : notificationReducer,
        
    },
});