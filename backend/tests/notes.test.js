import test from "node:test";
import { request, assertStatus, json } from "../test-utils.js";

const protectedRoutes = [
    ["PATCH", "/api/v1/notes/update-note-details/000000000000000000000000"],
    ["PATCH", "/api/v1/notes/update-note/000000000000000000000000"],
    ["GET", "/api/v1/notes/get-current-note/000000000000000000000000"],
    ["GET", "/api/v1/notes/get-my-notes"],
    ["GET", "/api/v1/notes/download-note/000000000000000000000000"],
    ["DELETE", "/api/v1/notes/delete-note/000000000000000000000000"],
];

for (const [method, path] of protectedRoutes) {
    test(`${method} ${path} should reject unauthenticated requests`, async () => {
        const result = await request(path, {
            method,
            ...(method === "PATCH" ? json({ title: "Updated title" }) : {}),
        });
        await assertStatus(result, 401);
    });
}

test("POST /notes/upload-notes should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/notes/upload-notes", {
        method: "POST",
    });
    await assertStatus(result, 401);
});

test("GET /notes/get-user-notes/:userName should return 404 for an unknown user", async () => {
    const result = await request("/api/v1/notes/get-user-notes/__definitely_unknown_user__");
    await assertStatus(result, 404);
});

test("GET /notes/search-notes should accept search, tag, sort, page and limit parameters", async () => {
    const result = await request(
        "/api/v1/notes/search-notes?search=javascript&tag=programming&sort=popular&page=1&limit=10"
    );
    await assertStatus(result, 200);
});
