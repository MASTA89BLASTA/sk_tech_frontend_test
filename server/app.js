require("@babel/register");
require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { sequelize, Message } = require("./db/models");

const serverConfig = require("./config/serverCofnig");
const indexRouter = require("./routes/index.routes");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

io.on("connection", socket => {
  console.log("Новое соединение", socket.id);
  socket.on("newMessage", async message => {
    try {
      const newMessage = await Message.create(message);
      io.emit("newMessage", newMessage);
    } catch (error) {
      console.error("Ошибка при сохранении сообщения:", error);
    }
  });
  socket.on("changeUsername", newUsername => {
    io.emit("updateUsername", newUsername);
  });

  socket.on("disconnect", () => {
    console.log("Клиент отключен");
  });
});
serverConfig(app);

app.use("/", indexRouter);

const PORT = process.env.PORT || 4000;

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully");
    server
      .listen(PORT)
      .on("listening", () => console.log("Сервер слушает порт"))
      .on("error", error => console.log("Ошибка при запуске сервера", error));
  } catch (error) {
    console.error("Unable to connect to the database", error);
  }
}

testConnection();
