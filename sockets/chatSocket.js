const jwt = require("jsonwebtoken");
const appEvents = require("../events/appEvents");

const chatSocket = (io) => {

  // Authenticate every socket connection
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("No token provided"));
    }

    try {
      socket.user = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      next();

    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });


  io.on("connection", (socket) => {

    console.log(
      `User connected: ${socket.user.username}`
    );

    // Join chat room
    socket.on("joinRoom", (room) => {

      if (
        typeof room !== "string" ||
        !room.trim() ||
        room.length > 50
      ) {
        return socket.emit("errorMessage", "Invalid room name");
      }

      const cleanRoom = room.trim();

      socket.join(cleanRoom);

      console.log(
        `${socket.user.username} joined room ${cleanRoom}`
      );

      io.to(cleanRoom).emit(
        "notification",
        `${socket.user.username} joined ${cleanRoom}`
      );
    });


    // Send chat message
    socket.on("chatMessage", (data = {}) => {

      const { room, message } = data;

      if (
        typeof room !== "string" ||
        typeof message !== "string" ||
        !room.trim() ||
        !message.trim()
      ) {
        return socket.emit(
          "errorMessage",
          "Room and message are required"
        );
      }

      const cleanRoom = room.trim();
      const cleanMessage = message.trim();

      if (cleanMessage.length > 1000) {
        return socket.emit(
          "errorMessage",
          "Message cannot exceed 1000 characters"
        );
      }

      // User must join the room before sending messages
      if (!socket.rooms.has(cleanRoom)) {
        return socket.emit(
          "errorMessage",
          "Join the room before sending messages"
        );
      }

      console.log(
        `[${cleanRoom}] ${socket.user.username}: ${cleanMessage}`
      );

      // Trigger EventEmitter
      appEvents.emit("chatMessage", {
        room: cleanRoom,
        username: socket.user.username
      });

      // Broadcast to room members
      io.to(cleanRoom).emit("message", {
        username: socket.user.username,
        message: cleanMessage,
        time: new Date()
      });

    });


    // Disconnect event
    socket.on("disconnect", () => {
      console.log(
        `User disconnected: ${socket.user.username}`
      );
    });

  });
};

module.exports = chatSocket;
