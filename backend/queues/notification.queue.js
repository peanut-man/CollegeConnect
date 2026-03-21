const { Queue } = require("bullmq");
const connection = require("../config/bullmq.redis");

let notificationQueue;

try {
  notificationQueue = new Queue("event-notifications", {
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
} catch (err) {
  console.warn(
    "BullMQ queue disabled. Notifications will be skipped:",
    err.message,
  );

  // Keep API routes operational in environments with unsupported Redis.
  notificationQueue = {
    add: async () => null,
  };
}

module.exports = notificationQueue;
