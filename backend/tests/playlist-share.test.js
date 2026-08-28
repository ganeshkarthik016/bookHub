import test from "node:test";
import { request, assertStatus, json } from "../test-utils.js";

const routes = [
    ["POST", "/api/v1/playlistShares/000000000000000000000000/share", { userId: "000000000000000000000000" }],
    ["GET", "/api/v1/playlistShares/editor"],
    ["GET", "/api/v1/playlistShares/viewer"],
    ["GET", "/api/v1/playlistShares/000000000000000000000000/members"],
    ["PATCH", "/api/v1/playlistShares/000000000000000000000000/members/000000000000000000000000", { role: "EDITOR" }],
    ["DELETE", "/api/v1/playlistShares/000000000000000000000000/members/000000000000000000000000"],
    ["DELETE", "/api/v1/playlistShares/000000000000000000000000/leave"],
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
