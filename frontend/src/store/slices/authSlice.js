import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    authChecked: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.authChecked = true;
        },

        restoreUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.authChecked = true;
        },

        loginFailure: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.authChecked = true;
        },

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.authChecked = true;
        },
    },
});

export const {
    loginSuccess,
    restoreUser,
    loginFailure,
    logout,
} = authSlice.actions;

export default authSlice.reducer;