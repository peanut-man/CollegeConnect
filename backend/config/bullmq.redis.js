const IORedis = require("ioredis");

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

connection.on("error", (err) => {
  console.error("BullMQ Redis Error:", err.message);
});

connection.on("connect", () => {
  console.log("BullMQ connected to Redis.");
});

module.exports = connection;
