require("dotenv").config();
const mongoose = require("mongoose");
const Task = require("./src/models/task.model");

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/qlvb");
  const count = await Task.countDocuments();
  console.log("Total tasks:", count);
  const tasks = await Task.find().limit(5);
  console.log("Sample tasks:", JSON.stringify(tasks, null, 2));
  mongoose.connection.close();
}

run();
