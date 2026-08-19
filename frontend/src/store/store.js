import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import notificationReducer from "./slices/notificationSlice.js";
import noteReducer from "./slices/noteSlice.js";
import playlistReducer from "./slices/playlistSlice.js";


export const store = configureStore({
    reducer: {
        auth : authReducer,
        notification : notificationReducer,
        note : noteReducer,
        playlist : playlistReducer,
    },
});