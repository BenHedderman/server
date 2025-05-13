const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const messages = [];

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("message", (msg) => {
    console.log("Message received: ", msg);
    messages.push(msg);
    if (messages.length > 20) {
      messages.shift();
    }
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
  socket.on("image", (image) => {
    io.emit("image", image);
  });
});

socket.on("getLastMessages", () => {
  socket.emit("lastMessages", messages);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
