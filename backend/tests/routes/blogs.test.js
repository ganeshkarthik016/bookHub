import test from "node:test";
import { request, assertStatus, json } from "../test-utils.js";

test("POST /blogs should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/blogs/", {
        method: "POST",
        ...json({
            title: "Test Written Note",
            description: "Test description",
            content: "Test content",
        }),
    });
    await assertStatus(result, 401);
});

test("GET /blogs should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/blogs/");
    await assertStatus(result, 401);
});

test("GET /blogs/:blogId should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/blogs/000000000000000000000000");
    await assertStatus(result, 401);
});

test("PATCH /blogs/:blogId should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/blogs/000000000000000000000000", {
        method: "PATCH",
        ...json({ title: "Updated title", content: "Updated content" }),
    });
    await assertStatus(result, 401);
});

test("DELETE /blogs/:blogId should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/blogs/000000000000000000000000", {
        method: "DELETE",
    });
    await assertStatus(result, 401);
});
