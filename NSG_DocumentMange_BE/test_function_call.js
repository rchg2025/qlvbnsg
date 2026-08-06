require("dotenv").config();
const mongoose = require("mongoose");
const { handleChat } = require("./src/controller/chatbot.controller");

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/qlvb");
  
  // mock request
  const req = {
    body: {
      message: "Hướng dẫn sử dụng phòng học trực tuyến từ năm học 2025-2026",
      userId: "6a2a64e4e0659ddcbbd88732" // Nguyễn Văn Luyện
    },
    user: {
      id: "6a2a64e4e0659ddcbbd88732"
    }
  };
  
  const res = {
    status: (code) => {
      console.log("Status:", code);
      return {
        json: (data) => console.log("JSON:", JSON.stringify(data, null, 2))
      };
    }
  };
  
  await handleChat(req, res);
  mongoose.connection.close();
}

run();
