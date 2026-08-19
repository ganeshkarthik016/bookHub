import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isSidebarOpen: false,
    activeModal: null,
    toast: null,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        setSidebarState: (state, action) => {
            state.isSidebarOpen = action.payload;
        },
        openModal: (state, action) => {
            state.activeModal = action.payload;
        },
        closeModal: (state) => {
            state.activeModal = null;
        },
        showToast: (state, action) => {
            state.toast = action.payload;
        },
        clearToast: (state) => {
            state.toast = null;
        },
    },
});

export const {
    toggleSidebar,
    setSidebarState,
    openModal,
    closeModal,
    showToast,
    clearToast,
} = uiSlice.actions;

export default uiSlice.reducer;