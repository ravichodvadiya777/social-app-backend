import "./helper/sendResponse";
import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes";
const app: Express = express();
const port = process.env.PORT || 3001;
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import http from "http";
import socket from "socket.io";
import chetHelper from "./db/chatHelper";
import { restart } from "./helper/restartServer";

// config & db
import "./db/db";
import chatSettingHelper from "./db/chatSettingHelper";
import userHelper from "./db/userHelper";
import "./cron";
import pushNotification from "./utils/pushNotification";
import User from "./model/userModel";

const cors_urls = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://qddfgq51-3000.inc1.devtunnels.ms",
];

app.use(
  cors({
    origin: cors_urls,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
app.use(router);

restart();

// socket

const server = http.createServer(app);
const io = new socket.Server(server, {
  cors: (cors, callback) => {
    if (cors_urls.includes(cors.headers["origin"])) {
      callback(null, { origin: true, credentials: false });
    } else {
      // callback(new Error("Not allowed by CORS"));
      callback(null, { origin: true, credentials: false });
    }
  },
});
global.io = io;
global.Onscreen = {};
global.onlineUsers = [];
const socketUsers = new Map();

io.on("connection", (socket) => {
  socket.on("joinRoom", (data) => {
    socketUsers.set(socket.id, data.user);
    if (!global.onlineUsers.includes(data.user)) {
      global.onlineUsers.push(data.user);
    }
    socket.join(data.user);
    socket.emit("message", `Welcome to the room.`);
    io.emit("isOnline", { onlineUsers: global.onlineUsers });
  });

  socket.on("sendMessage", async (data) => {
    const sender = data.sender;
    const receiver = data.receiver;
    if (sender > receiver) {
      data.conversationId = data.receiver + data.sender;
    } else {
      data.conversationId = data.sender + data.receiver;
    }
    const receiverScreen = global.Onscreen[data.receiver];
    if (receiverScreen == data.sender) {
      data.read = true;
    }
    socket.to(data.receiver).emit("sendMessage", data);
    const chatConversation = await chatSettingHelper.findOne({
      conversationId: data.conversationId,
    });
    await chetHelper.insertOne(data);

    if (!chatConversation) {
      const sender = await userHelper.findOne(
        { _id: data.sender },
        "name username profileImg"
      );
      const newChatUser = {
        _id: data.sender,
        conversationId: data.conversationId,
        username: sender.username,
        profileImg: sender.profileImg,
        name: sender.name,
        unread_msg: 1,
        delete24View: false,
        deleteAfterView: false,
      };
      socket.to(data.receiver).emit("newChatUser", newChatUser);
      await chatSettingHelper.insertOne({
        conversationId: data.conversationId,
        user1: data.sender,
        user2: data.receiver,
      });
    }
  });

  socket.on("onScreen", async (data) => {
    global.Onscreen[data.userId] = data.screenId;
  });

  socket.on("back", (data) => {
    if (data.userId) delete global.Onscreen[data.userId];
  });

  socket.on("typing", (data) => {
    socket
      .to(global.Onscreen[data.userId])
      .emit("typing", { typing: data.typing });
  });

  socket.on("callRequest", async (data) => {
    socket.to(data.to._id).emit("sendCallRequest", {
      to: data.from,
      from: data.to,
      signal: data.signal,
    });
    const user = await User.findById(data.to._id);
    pushNotification(
      `Incoming call`,
      `${user.username} calling you...`,
      {
        type: "INCOMING CALL",
      },
      [data.to._id.toString()]
    );
  });

  socket.on("answerCall", (data) => {
    console.log("answerCall", data.to._id);
    io.to(data.to._id).emit("callAccepted", data.signal);
  });

  socket.on("screenShare", (data) => {
    console.log("screenStream", data);
    // Relay the screenShare event to the intended recipient
    io.to(data.to).emit("screenShare", data);
  });

  socket.on("screenShareEnd", (data) => {
    // Relay the screenShareEnd event to the intended recipient
    io.to(data.to).emit("screenShareEnd");
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
    const user = socketUsers.get(socket.id);
    if (global.onlineUsers.includes(user)) {
      const i = global.onlineUsers.indexOf(user);
      global.onlineUsers.splice(i, 1);
      io.emit("isOnline", { onlineUsers: global.onlineUsers });
    }
    socketUsers.delete(socket.id);
  });
});

server.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
