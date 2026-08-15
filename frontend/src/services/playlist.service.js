import api from "./api";

export const getMyPlaylists = () => api.get("/playlists/get-my-playlists");
export const createPlaylist = (data) => api.post("/playlists/create", data);
export const updatePlaylist = (playlistId, data) => api.patch(`/playlists/edit-playlist/${playlistId}`, data);
export const deletePlaylist = (playlistId) => api.delete(`/playlists/delete-playlist/${playlistId}`);
export const getPlaylistItems = (playlistId) => api.get(`/playlists/get-playlist-items/${playlistId}`);
