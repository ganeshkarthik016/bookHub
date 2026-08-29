import test from "node:test";
import { request, assertStatus, json } from "../test-utils.js";

const routes = [
    ["GET", "/api/v1/comments/get-comments/000000000000000000000000"],
    ["GET", "/api/v1/comments/get-my-comments"],
];

for (const [method, path] of routes) {
    test(`${method} ${path} should reject unauthenticated requests`, async () => {
        const result = await request(path, { method });
        await assertStatus(result, 401);
    });
}

test("POST /comments/add-comment/:noteId should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/comments/add-comment/000000000000000000000000", {
        method: "POST",
        ...json({ content: "Test comment" }),
    });
    await assertStatus(result, 401);
});

test("PATCH /comments/edit-comment/:commentId should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/comments/edit-comment/000000000000000000000000", {
        method: "PATCH",
        ...json({ content: "Updated comment" }),
    });
    await assertStatus(result, 401);
});

test("DELETE /comments/delete-comment/:commentId should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/comments/delete-comment/000000000000000000000000", {
        method: "DELETE",
    });
    await assertStatus(result, 401);
});
