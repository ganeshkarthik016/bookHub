import test from "node:test";
import assert from "node:assert/strict";
import {
    request,
    assertStatus,
    json,
    loginAndGetCookie,
    authTestAvailable,
} from "../test-utils.js";

test("GET /health should report the API as healthy", async () => {
    const result = await request("/health");
    await assertStatus(result, 200);
    assert.equal(result.body.status, "ok");
});

test("POST /users/register should reject a request with missing required fields", async () => {
    const result = await request("/api/v1/users/register", {
        method: "POST",
        ...json({}),
    });
    await assertStatus(result, 400);
});

test("POST /users/login should reject missing identifier", async () => {
    const result = await request("/api/v1/users/login", {
        method: "POST",
        ...json({ password: "Password123" }),
    });
    await assertStatus(result, 400);
});

test("POST /users/login should reject missing password", async () => {
    const result = await request("/api/v1/users/login", {
        method: "POST",
        ...json({ identifier: "missing@example.com" }),
    });
    await assertStatus(result, 400);
});

test("POST /users/refresh-token should reject a missing refresh token", async () => {
    const result = await request("/api/v1/users/refresh-token", {
        method: "POST",
        ...json({}),
    });
    await assertStatus(result, 401);
});

test("POST /users/forgot-password-otp should reject missing username and email", async () => {
    const result = await request("/api/v1/users/forgot-password-otp", {
        method: "POST",
        ...json({}),
    });
    await assertStatus(result, 400);
});

test("POST /users/verify-reset-password-otp should reject missing email", async () => {
    const result = await request("/api/v1/users/verify-reset-password-otp", {
        method: "POST",
        ...json({ otp: "123456", newPassword: "Password123", confirmPassword: "Password123" }),
    });
    await assertStatus(result, 400);
});

test("PATCH /users/change-password should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/users/change-password", {
        method: "PATCH",
        ...json({
            oldPassword: "OldPassword123",
            newPassword: "NewPassword123",
            confirmPassword: "NewPassword123",
        }),
    });
    await assertStatus(result, 401);
});

test("PATCH /users/update-account-details should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/users/update-account-details", {
        method: "PATCH",
        ...json({ userFullName: "Updated User" }),
    });
    await assertStatus(result, 401);
});

test("PATCH /users/change-gmail should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/users/change-gmail", {
        method: "PATCH",
        ...json({ email: "new@example.com" }),
    });
    await assertStatus(result, 401);
});

test("PATCH /users/update-profile-pic should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/users/update-profile-pic", {
        method: "PATCH",
    });
    await assertStatus(result, 401);
});

test("GET /users/get-current-user should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/users/get-current-user");
    await assertStatus(result, 401);
});

test("GET /users/profile/:userName should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/users/profile/test-user");
    await assertStatus(result, 401);
});

test("GET /users/search should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/users/search?query=test");
    await assertStatus(result, 401);
});

test("DELETE /users/delete-account should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/users/delete-account", {
        method: "DELETE",
        ...json({ password: "Password123" }),
    });
    await assertStatus(result, 401);
});

test("POST /users/logout should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/users/logout", { method: "POST" });
    await assertStatus(result, 401);
});

test("POST /users/send-verification-otp should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/users/send-verification-otp", {
        method: "POST",
    });
    await assertStatus(result, 401);
});

test("POST /users/verify-email-otp should reject unauthenticated requests", async () => {
    const result = await request("/api/v1/users/verify-email-otp", {
        method: "POST",
        ...json({ otp: "123456" }),
    });
    await assertStatus(result, 401);
});

test("Authenticated user flow should login when TEST_IDENTIFIER and TEST_PASSWORD are supplied", { skip: !authTestAvailable() }, async () => {
    const cookie = await loginAndGetCookie();
    assert.ok(cookie);
});
