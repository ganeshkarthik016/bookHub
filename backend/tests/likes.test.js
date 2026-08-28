import test from "node:test";
import { request, assertStatus } from "../test-utils.js";

const routes = [
    ["POST", "/api/v1/likes/toggle/000000000000000000000000"],
    ["GET", "/api/v1/likes/my-likes"],
    ["GET", "/api/v1/likes/is-liked/000000000000000000000000"],
    ["GET", "/api/v1/likes/note/000000000000000000000000"],
];

for (const [method, path] of routes) {
    test(`${method} ${path} should reject unauthenticated requests`, async () => {
        const result = await request(path, { method });
        await assertStatus(result, 401);
    });
}
