const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Apply CORS middleware to Express
app.use(cors({
  origin: "http://localhost:3000", // Allow frontend origin
  methods: ["GET", "POST"],       // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true,              // Allow credentials (cookies, etc.)
}));

// Explicitly set headers for all Express responses
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Configure CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend origin
    methods: ["GET", "POST"],       // Allowed methods
    credentials: true,              // Allow credentials
  },
});

// Handle Socket.IO events
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    console.log("Message received:", data);
    io.emit("receive_message", data); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(5001, () => {
  console.log("Server is running on http://localhost:5001");
});
