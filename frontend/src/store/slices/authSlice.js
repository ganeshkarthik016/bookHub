import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    authChecked: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        loginStart: (state) => {
            state.loading = true;
        },

        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.authChecked = true;
        },

        loginFailure: (state) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.authChecked = true;
        },

        restoreUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
            state.authChecked = true;
        },

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.authChecked = true;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    restoreUser,
    logout,
} = authSlice.actions;

export default authSlice.reducer;