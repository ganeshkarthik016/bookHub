import test from "node:test";
import { request, assertStatus, json } from "../test-utils.js";

const routes = [
    ["GET", "/api/v1/notifications/count"],
    ["GET", "/api/v1/notifications/unread"],
    ["GET", "/api/v1/notifications/"],
    ["PATCH", "/api/v1/notifications/read-all"],
    ["PATCH", "/api/v1/notifications/000000000000000000000000/read"],
    ["DELETE", "/api/v1/notifications/000000000000000000000000"],
];

for (const [method, path] of routes) {
    test(`${method} ${path} should reject unauthenticated requests`, async () => {
        const result = await request(path, { method });
        await assertStatus(result, 401);
    });
}
