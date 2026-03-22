const Redis = require("ioredis");

let redisClient = null;

if (process.env.REDIS_URL) {
  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      retryStrategy: (times) => {
        if (times > 3) {
          console.warn("Redis connection failed. Features requiring Redis will be degraded.");
          return null; // Stop retrying
        }
        return Math.min(times * 50, 2000);
      },
    });

    redisClient.on("error", (err) => {
      console.warn("Redis Error:", err.message);
    });

    redisClient.on("connect", () => {
      console.log("Connected to Redis.");
    });
  } catch (err) {
    console.error("Failed to initialize Redis:", err.message);
    redisClient = null;
  }
} else {
  console.log("No REDIS_URL provided. Redis and BullMQ features disabled.");
}

module.exports = redisClient;
