import http from "http";
import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { initSocket } from "./src/sockets/index.js";
import { connectDb } from "./src/db/db.js";

const PORT = process.env.PORT || 5000;

// 🔥 Create HTTP server
const server = http.createServer(app);

// 🔥 Initialize Socket.IO
const io = initSocket(server);

// Make io available inside controllers via req.app.get("io")
app.set("io", io);

// 🔥 Connect Database then Start Server
connectDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server + Socket running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });

// 🔥 Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  process.exit(1);
});
