const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const connectToDb = require("../config/db");
const User = require("../models/user.model");

async function createAdmin() {
  try {
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
    }

    await connectToDb();

    const existingAdmin = await User.findOne({ role: "Admin" });
    if (existingAdmin) {
      console.log(`Admin already exists: ${existingAdmin.email}`);
      process.exit(0);
    }

    const hashedPassword = await User.hashPassword(ADMIN_PASSWORD);
    const admin = await User.create({
      name: "System Admin",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "Admin",
    });

    console.log(`Admin created successfully: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message || error);
    process.exit(1);
  }
}

createAdmin();
