import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    myPlaylists: [],
    currentPlaylist: null,
    playlistItems: [],
    playlistMembers: [],
    loading: false,
};

const playlistSlice = createSlice({
    name: "playlists",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        
        // --- PLAYLIST MANAGEMENT ---
        setMyPlaylists: (state, action) => {
            state.myPlaylists = action.payload;
        },
        addPlaylist: (state, action) => {
            state.myPlaylists.unshift(action.payload);
        },
        updatePlaylistInList: (state, action) => {
            const updated = action.payload;
            const index = state.myPlaylists.findIndex((p) => p._id === updated._id);
            if (index !== -1) {
                state.myPlaylists[index] = updated;
            }
            if (state.currentPlaylist && state.currentPlaylist._id === updated._id) {
                state.currentPlaylist = updated;
            }
        },
        removePlaylistFromList: (state, action) => {
            state.myPlaylists = state.myPlaylists.filter((p) => p._id !== action.payload);
            if (state.currentPlaylist && state.currentPlaylist._id === action.payload) {
                state.currentPlaylist = null;
                state.playlistItems = [];
                state.playlistMembers = [];
            }
        },

        // --- CURRENT VIEW DATA ---
        setCurrentPlaylist: (state, action) => {
            state.currentPlaylist = action.payload;
        },
        setPlaylistItems: (state, action) => {
            state.playlistItems = action.payload;
        },
        
        // For optimistic drag-and-drop reordering
        reorderPlaylistItems: (state, action) => {
            state.playlistItems = action.payload; 
        },

        // --- COLLABORATOR MANAGEMENT ---
        setPlaylistMembers: (state, action) => {
            state.playlistMembers = action.payload;
        },
        addMember: (state, action) => {
            state.playlistMembers.push(action.payload);
        },
        updateMemberInList: (state, action) => {
            const updatedMember = action.payload;
            const index = state.playlistMembers.findIndex(m => m.user._id === updatedMember.user._id);
            if (index !== -1) {
                state.playlistMembers[index] = updatedMember;
            }
        },
        removeMemberFromList: (state, action) => {
            state.playlistMembers = state.playlistMembers.filter(m => m.user._id !== action.payload);
        },

        clearPlaylistData: (state) => {
            state.myPlaylists = [];
            state.currentPlaylist = null;
            state.playlistItems = [];
            state.playlistMembers = [];
        }
    },
});

export const {
    setLoading,
    setMyPlaylists,
    addPlaylist,
    updatePlaylistInList,
    removePlaylistFromList,
    setCurrentPlaylist,
    setPlaylistItems,
    reorderPlaylistItems,
    setPlaylistMembers,
    addMember,
    updateMemberInList,
    removeMemberFromList,
    clearPlaylistData
} = playlistSlice.actions;

export default playlistSlice.reducer;