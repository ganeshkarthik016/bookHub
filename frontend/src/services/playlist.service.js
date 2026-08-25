import api from "./api.js";
import { apiError } from "../utils/apiError.js";

const handleError = (error) => {
    throw new apiError(
        error.response?.status || 500,
        error.response?.data?.message || "Something went wrong",
        error.response?.data?.errors || []
    );
};

// --- CORE PLAYLIST ROUTES ---

export const createPlaylist = async (playlistData) => {
    try {
        const response = await api.post("/playlists/create", playlistData);
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const editPlaylist = async (playlistId, playlistData) => {
    try {
        const response = await api.patch(`/playlists/edit-playlist/${playlistId}`, playlistData);
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const getMyPlaylists = async () => {
    try {
        const response = await api.get("/playlists/get-my-playlists");
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const getPlaylist = async (playlistId) => {
    try {
        const response = await api.get(`/playlists/get-playlist/${playlistId}`);
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const getPlaylistItems = async (playlistId) => {
    try {
        const response = await api.get(`/playlists/get-playlist-items/${playlistId}`);
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const deletePlaylist = async (playlistId) => {
    try {
        const response = await api.delete(`/playlists/delete-playlist/${playlistId}`);
        return response.data.data;
    } catch (error) { handleError(error); }
};

// --- PLAYLIST ITEM MANAGEMENT ---

export const toggleNoteInPlaylist = async (playlistId, noteId) => {
    try {
        const response = await api.post(`/playlists/add-to-playlist/${playlistId}`, { noteId });
        return response.data.data; // returns { isAdded: boolean }
    } catch (error) { handleError(error); }
};

export const getUserPlaylistsWithNoteStatus = async (noteId) => {
    try {
        const response = await api.get(`/playlists/get-user-playlists-with-note-status/${noteId}`);
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const editPlaylistItemOrder = async (playlistId, itemsOrder) => {
    try {
        const response = await api.patch(`/playlists/edit-playlist-item-order/${playlistId}`, { itemsOrder });
        return response.data.data;
    } catch (error) { handleError(error); }
};

// --- PLAYLIST SHARE ROUTES ---

export const getPlaylistMembers = async (playlistId) => {
    try {
        const response = await api.get(`/playlistShares/${playlistId}/members`);
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const sharePlaylist = async (playlistId, userName, role) => {
    try {
        const response = await api.post(`/playlistShares/${playlistId}/share`, { userName, role });
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const updateMemberRole = async (playlistId, userId, role) => {
    try {
        const response = await api.patch(`/playlistShares/${playlistId}/members/${userId}`, { role });
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const removeMember = async (playlistId, userId) => {
    try {
        const response = await api.delete(`/playlistShares/${playlistId}/members/${userId}`);
        return response.data.data;
    } catch (error) { handleError(error); }
};

// --- MISSING PLAYLIST ROUTES ---

export const getUserPlaylists = async (userName) => {
    try {
        const response = await api.get(`/playlists/get-user-playlists/${userName}`); 
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const isNotePresentInPlaylist = async (playlistId) => {
    try {
        const response = await api.get(`/playlists/is-note-present-in-playlist/${playlistId}`); 
        return response.data.data;
    } catch (error) { handleError(error); }
};

// --- MISSING PLAYLIST SHARE ROUTES ---

export const getMyEditorPlaylists = async () => {
    try {
        const response = await api.get("/playlistShares/editor"); 
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const getMyViewerPlaylists = async () => {
    try {
        const response = await api.get("/playlistShares/viewer"); 
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const leavePlaylist = async (playlistId) => {
    try {
        const response = await api.delete(`/playlistShares/${playlistId}/leave`); 
        return response.data.data;
    } catch (error) { handleError(error); }
};