import test from "node:test";
import { request, assertStatus, json } from "../test-utils.js";

const routes = [
    ["POST", "/api/v1/playlists/create", { name: "Test Playlist" }],
    ["POST", "/api/v1/playlists/add-to-playlist/000000000000000000000000", {}],
    ["PATCH", "/api/v1/playlists/edit-playlist/000000000000000000000000", { name: "Updated Playlist" }],
    ["PATCH", "/api/v1/playlists/edit-playlist-item-order/000000000000000000000000", { itemOrder: [] }],
    ["GET", "/api/v1/playlists/get-playlist/000000000000000000000000"],
    ["GET", "/api/v1/playlists/get-my-playlists"],
    ["GET", "/api/v1/playlists/get-playlist-items/000000000000000000000000"],
    ["DELETE", "/api/v1/playlists/delete-playlist/000000000000000000000000"],
    ["GET", "/api/v1/playlists/get-user-playlists/__unknown_user__"],
    ["GET", "/api/v1/playlists/get-user-playlists-with-note-status/000000000000000000000000"],
    ["GET", "/api/v1/playlists/is-note-present-in-playlist/000000000000000000000000"],
];

for (const [method, path, body] of routes) {
    test(`${method} ${path} should reject unauthenticated requests`, async () => {
        const result = await request(path, {
            method,
            ...(body ? json(body) : {}),
        });
        await assertStatus(result, 401);
    });
}
