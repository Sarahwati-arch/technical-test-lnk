import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.model";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/technical-test-lnk";

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing users
    await User.deleteMany({});

    // Create dummy user
    const user = new User({
      username: "admin",
      password: "password123",
    });

    await user.save();
    console.log(`Dummy user created: username=${user.username}, password=password123`);

    console.log("Seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
