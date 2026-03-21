require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const User = require("../models/user.model");
const Event = require("../models/event.model");
const College = require("../models/college.model");

const ORGANIZER_COUNT = 25;
const EVENT_COUNT = 100;

const CATEGORIES = ["Hackathon", "Seminar", "Fest", "Workshop", "Other"];

const EVENT_TITLES = {
  Hackathon: ["Code Sprint", "Dev Challenge", "Innovation Hack", "Build-a-thon", "Tech Marathon"],
  Seminar: ["Tech Talk", "Industry Insights", "Expert Session", "Knowledge Share", "Deep Dive"],
  Fest: ["Tech Fest", "Cultural Fest", "Annual Carnival", "Spring Fest", "College Fiesta"],
  Workshop: ["Hands-on Lab", "Skill Builder", "Bootcamp", "Masterclass", "Training Session"],
  Other: ["Networking Event", "Career Fair", "Open Mic", "Panel Discussion", "Meetup"],
};

const DESCRIPTIONS = [
  "Join us for an exciting event filled with learning opportunities and networking.",
  "Don't miss this chance to enhance your skills and connect with industry experts.",
  "An engaging session designed to inspire and educate participants.",
  "Explore new ideas and collaborate with like-minded peers.",
  "A must-attend event for anyone looking to grow professionally and personally.",
];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFutureDate(daysAhead) {
  const now = new Date();
  const futureMs = now.getTime() + randomInt(1, daysAhead) * 24 * 60 * 60 * 1000;
  return new Date(futureMs);
}

function randomTime() {
  const hour = randomInt(9, 20);
  const minute = randomElement(["00", "30"]);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute} ${period}`;
}

function generateEventTitle(category, index) {
  const prefix = randomElement(EVENT_TITLES[category]);
  return `${prefix} ${index + 1}`;
}

function renderProgress(label, processed, total) {
  const percent = Math.round((processed / total) * 100);
  const filled = Math.round(percent / 5);
  const bar = "█".repeat(filled) + "░".repeat(20 - filled);
  process.stdout.write(`\r  ${label}: [${bar}] ${percent}% (${processed}/${total})`);
}

async function seedUsersAndEvents() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database\n");

    // Fetch all colleges
    const colleges = await College.find({}, "_id");
    if (colleges.length === 0) {
      console.error("No colleges found. Run seedColleges.js first.");
      process.exit(1);
    }
    console.log(`Found ${colleges.length} colleges\n`);

    // Clean up existing test data
    const deletedUsers = await User.deleteMany({ email: /@test\.com$/ });
    const deletedEvents = await Event.deleteMany({
      organizerId: { $exists: true },
      title: /^(Code Sprint|Dev Challenge|Innovation Hack|Build-a-thon|Tech Marathon|Tech Talk|Industry Insights|Expert Session|Knowledge Share|Deep Dive|Tech Fest|Cultural Fest|Annual Carnival|Spring Fest|College Fiesta|Hands-on Lab|Skill Builder|Bootcamp|Masterclass|Training Session|Networking Event|Career Fair|Open Mic|Panel Discussion|Meetup)/,
    });

    console.log(`Cleaned up ${deletedUsers.deletedCount} test users`);
    console.log(`Cleaned up ${deletedEvents.deletedCount} test events\n`);

    // Create organizer users
    console.log("Creating organizer users...");
    const hashedPassword = await User.hashPassword("password123");

    const usersToInsert = [];
    for (let i = 1; i <= ORGANIZER_COUNT; i++) {
      usersToInsert.push({
        name: `Test Organizer ${i}`,
        email: `organizer${i}@test.com`,
        password: hashedPassword,
        role: "Organizer",
        collegeId: randomElement(colleges)._id,
      });
      renderProgress("Users", i, ORGANIZER_COUNT);
    }

    const insertedUsers = await User.insertMany(usersToInsert);
    process.stdout.write("\n");
    console.log(`Inserted ${insertedUsers.length} organizer users\n`);

    // Create events
    console.log("Creating events...");
    const eventsToInsert = [];

    for (let i = 0; i < EVENT_COUNT; i++) {
      const category = randomElement(CATEGORIES);
      const organizer = randomElement(insertedUsers);
      const college = randomElement(colleges);

      eventsToInsert.push({
        title: generateEventTitle(category, i),
        description: randomElement(DESCRIPTIONS),
        category,
        eventDate: randomFutureDate(30),
        eventTime: randomTime(),
        collegeId: college._id,
        organizerId: organizer._id,
        likesCount: randomInt(0, 50),
        isActive: true,
      });
      renderProgress("Events", i + 1, EVENT_COUNT);
    }

    const insertedEvents = await Event.insertMany(eventsToInsert);
    process.stdout.write("\n");
    console.log(`Inserted ${insertedEvents.length} events\n`);

    // Summary
    console.log("========================================");
    console.log("           SEEDING COMPLETE            ");
    console.log("========================================");
    console.log(`  Organizers created : ${insertedUsers.length}`);
    console.log(`  Events created     : ${insertedEvents.length}`);
    console.log(`  Test password      : password123`);
    console.log("========================================\n");

    process.exit(0);
  } catch (err) {
    process.stdout.write("\n");
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

seedUsersAndEvents();
