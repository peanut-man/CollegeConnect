const { Queue } = require("bullmq");
const connection = require("../config/bullmq.redis");

const NOOP_QUEUE = {
  add: async () => null,
};

let queueInitPromise;

const initQueue = async () => {
  if (String(process.env.DISABLE_BULLMQ || "").toLowerCase() === "true") {
    console.warn("BullMQ disabled via DISABLE_BULLMQ=true.");
    return null;
  }

  const queue = new Queue("event-notifications", {
    connection,
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
    // Prevent hard crashes from Redis/BullMQ issues in dev environments.
    console.warn("BullMQ queue error (notifications may be skipped):", err.message);
  });

  // BullMQ checks Redis version when becoming ready; this will reject on Redis < 5.
  await queue.waitUntilReady();
  return queue;
};

const getQueue = async () => {
  if (!queueInitPromise) {
    queueInitPromise = initQueue().catch((err) => {
      console.warn(
        "BullMQ queue disabled. Notifications will be skipped:",
        err.message,
      );
      return null;
    });
  }
  return queueInitPromise;
};

module.exports = {
  add: async (...args) => {
    const queue = await getQueue();
    if (!queue) return NOOP_QUEUE.add();
    return queue.add(...args);
  },
};
