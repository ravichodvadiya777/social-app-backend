import "./helper/sendResponse"
import express, {Express} from 'express';
import dotenv from 'dotenv';
dotenv.config();
import router from "./routes";
const app:Express = express();
const port = process.env.PORT || 3001;
import cors from "cors";
import fileUpload from "express-fileupload"
import cookieParser from "cookie-parser";
import http from "http"
import socket  from "socket.io";
import chetHelper from "./db/chatHelper";

// config & db
import "./db/db";

app.use(
  cors({
    origin: [
      "http://localhost:3001",
    ],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
app.use(router)

// socket 

const server = http.createServer(app);
const io = new socket.Server(server);
global.Onscreen = {}

io.on('connection', socket => {
  socket.on('joinRoom', data => {
    // {
    //   "user" : "66027364722ea067d6b81a63",
    // }
    
    socket.join(data.user);
    socket.emit("message", `Welcome to the room.`);
    socket.broadcast.emit("isOnline",true);
  });

  socket.on('sendMessage', async data => {
    // {
    //   sender : "",
    //   receiver : "",
    //   msg : "",
    //   type : ""
    // }
    const sender = data.sender;
    const receiver = data.receiver;
    if(sender > receiver){
      data.conversationId = data.receiver + data.sender;
    }else{
      data.conversationId = data.sender + data.receiver;
    }
    const receiverScreen = global.Onscreen[data.receiver]
    if (receiverScreen == data.sender){
      data.read = true
    }
    socket.to(data.receiver).emit("sendMessage",data);
    await chetHelper.insertOne(data);

  })

  socket.on('onScreen', async data => {
    // {
    //   userId : "",
    //   screenId : ""
    // }
    global.Onscreen[data.userId] = data.screenId;
  })
  socket.on('disconnect', () => {});
});


server.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});