require("dotenv").config();
const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const connectToDb = require("../config/db");
const redisClient = require("../config/redis");
const { sendEventNotification } = require("../services/email.service");
const EventModel = require("../models/event.model");
const UserModel = require("../models/user.model");

const processEventNotification = async (job) => {
  const { eventId, collegeId } = job.data;
  console.log(`Processing job ${job.id}: eventId=${eventId}, collegeId=${collegeId}`);

  const event = await EventModel.findById(eventId);
  if (!event) {
    throw new Error(`Event not found: ${eventId}`);
  }

  const users = await UserModel.find({ collegeId }).select("name email");
  if (users.length === 0) {
    console.log(`No users found for collegeId: ${collegeId}`);
    return { sent: 0 };
  }

  console.log(`Sending notifications to ${users.length} users...`);

  let sentCount = 0;
  let failedCount = 0;

  for (const user of users) {
    try {
      await sendEventNotification(user, event);
      sentCount++;
      console.log(`Email sent to: ${user.email}`);
    } catch (err) {
      failedCount++;
      console.error(`Failed to send email to ${user.email}:`, err.message);
    }
  }

  console.log(`Job ${job.id} completed: ${sentCount} sent, ${failedCount} failed`);
  return { sent: sentCount, failed: failedCount };
};

const startWorker = async () => {
  if (!redisClient) {
    console.warn("Redis disabled, worker not starting.");
    return;
  }

  await connectToDb();

  const worker = new Worker("event-notifications", processEventNotification, {
    connection: redisClient,
    concurrency: 5,
  });

  worker.on("completed", (job, result) => {
    console.log(`Job ${job.id} completed:`, result);
  });

  worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
  });

  worker.on("error", (err) => {
    console.error("Worker error:", err.message);
  });

  console.log("Notification worker started. Waiting for jobs...");

  const shutdown = async () => {
    console.log("Shutting down worker...");
    await worker.close();
    await mongoose.disconnect();
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

startWorker().catch((err) => {
  console.error("Failed to start worker:", err);
  process.exit(1);
});
