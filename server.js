require("dotenv").config();

const express = require("express");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chatSocket = require("./sockets/chatSocket");

require("./events/listeners");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`[server] listening on http://localhost:${PORT}`);
    });

    const io = new Server(server, {
      cors: {
        origin: "*"
      }
    });

    chatSocket(io);
  })
  .catch((error) => {
    console.error("[server] Database connection failed:", error);
    process.exit(1);
  });
