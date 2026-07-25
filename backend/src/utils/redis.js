import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

export const connectRedis = async () => {
    await redisClient.connect();
    console.log("Redis connected successfully");
};

export const unreadKey = (userId) => `notifications:unread:${userId}`;
export const countKey = (userId) => `notifications:count:${userId}`;

export { redisClient };