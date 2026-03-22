const { Queue } = require("bullmq");
const redisClient = require("../config/redis");

const NOOP_QUEUE = {
  add: async () => null,
};

let queue = null;

if (redisClient) {
  queue = new Queue("event-notifications", {
    connection: redisClient,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: 100,
      removeOnFail: 50,
    },
  });

  queue.on("error", (err) => {
    console.warn("BullMQ queue error (notifications may be skipped):", err.message);
  });
}

module.exports = {
  add: async (...args) => {
    if (!queue) return NOOP_QUEUE.add();
    try {
      return await queue.add(...args);
    } catch (err) {
      console.warn("Failed to queue job, skipping:", err.message);
      return null;
    }
  },
};
