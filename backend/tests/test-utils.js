
import assert from "node:assert/strict";

export const BASE_URL = process.env.BASE_URL || "http://localhost:8000";
export const TEST_IDENTIFIER = process.env.TEST_IDENTIFIER;
export const TEST_PASSWORD = process.env.TEST_PASSWORD;

export async function request(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
        redirect: "manual",
        ...options,
    });

    const text = await response.text();
    let body = {};
    try {
        body = text ? JSON.parse(text) : {};
    } catch {
        body = { raw: text };
    }

    return { response, body };
}

export async function assertStatus(result, expected, message = "") {
    assert.equal(
        result.response.status,
        expected,
        `${message}\nExpected ${expected}, received ${result.response.status}\nResponse: ${JSON.stringify(result.body)}`
    );
}

export function json(data) {
    return {
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
    };
}

export function authTestAvailable() {
    return Boolean(TEST_IDENTIFIER && TEST_PASSWORD);
}

export async function loginAndGetCookie() {
    if (!authTestAvailable()) return null;

    const result = await request("/api/v1/users/login", {
        method: "POST",
        ...json({
            identifier: TEST_IDENTIFIER,
            password: TEST_PASSWORD,
        }),
    });

    assert.equal(result.response.status, 200, JSON.stringify(result.body));

    const setCookie = result.response.headers.get("set-cookie");
    assert.ok(setCookie, "Login did not return a Set-Cookie header");

    const cookies = setCookie
        .split(/,(?=[^;]+=[^;]+)/)
        .map((cookie) => cookie.split(";")[0])
        .join("; ");

    return cookies;
}
