import test from "node:test";
import { request, assertStatus } from "../test-utils.js";

const routes = [
    ["POST", "/api/v1/follows/toggle/000000000000000000000000"],
    ["GET", "/api/v1/follows/is-following/000000000000000000000000"],
    ["GET", "/api/v1/follows/followers/000000000000000000000000"],
    ["GET", "/api/v1/follows/following/000000000000000000000000"],
    ["GET", "/api/v1/follows/my-friends"],
    ["GET", "/api/v1/follows/suggestions"],
];

for (const [method, path] of routes) {
    test(`${method} ${path} should reject unauthenticated requests`, async () => {
        const result = await request(path, { method });
        await assertStatus(result, 401);
    });
}
