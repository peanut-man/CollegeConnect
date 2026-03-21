require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const College = require("../models/college.model");
const colleges = require("../data/colleges.json");

const BATCH_SIZE = parseInt(process.env.SEED_BATCH_SIZE, 10) || 50;

function renderProgress(processed, total) {
  const percent = Math.round((processed / total) * 100);
  const filled = Math.round(percent / 5);
  const bar = "█".repeat(filled) + "░".repeat(20 - filled);
  process.stdout.write(`\r  [${bar}] ${percent}% (${processed}/${total})`);
}

async function ensureUniqueIndex() {
  await College.collection.createIndex({ name: 1 }, { unique: true });
}

async function seedColleges() {
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to database");

    await ensureUniqueIndex();
    console.log("✅ Unique index on 'name' ensured");

    const totalInput = colleges.length;

    // 🔍 Step 1: Fetch existing college names
    const existingDocs = await College.find({}, { name: 1, _id: 0 });
    const existingSet = new Set(existingDocs.map((c) => c.name));

    // 🔍 Step 2: Filter only new colleges and transform to match schema
    const newColleges = colleges
      .filter((c) => !existingSet.has(c.name))
      .map((c) => ({
        ...c,
        location: {
          type: "Point",
          coordinates: [c.longitude, c.latitude], // GeoJSON: [lng, lat]
        },
      }));

    const totalNew = newColleges.length;

    console.log(`\n📊 Total in file     : ${totalInput}`);
    console.log(`📊 Already in DB    : ${existingSet.size}`);
    console.log(`📊 New to insert    : ${totalNew}\n`);

    if (totalNew === 0) {
      console.log("🎉 No new colleges to insert. Database is up to date.");
      process.exit(0);
    }

    // 🚀 Step 3: Insert in batches
    let inserted = 0;

    for (let i = 0; i < totalNew; i += BATCH_SIZE) {
      const batch = newColleges.slice(i, i + BATCH_SIZE);

      try {
        const result = await College.insertMany(batch, { ordered: false });
        inserted += result.length;
      } catch (err) {
        // BulkWriteError still inserts non-duplicate docs
        if (err.insertedDocs) {
          inserted += err.insertedDocs.length;
        } else if (err.result?.insertedCount) {
          inserted += err.result.insertedCount;
        }
      }
      renderProgress(Math.min(i + BATCH_SIZE, totalNew), totalNew);
    }

    process.stdout.write("\n\n");

    console.log("🎉 Seeding complete!");
    console.log(`  ✅ Inserted : ${inserted}`);
    console.log(`  ⏭️ Skipped  : ${existingSet.size} (already existed)`);

    process.exit(0);
  } catch (err) {
    process.stdout.write("\n");
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seedColleges();