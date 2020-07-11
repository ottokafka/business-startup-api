const express = require("express");
const mongoose = require("mongoose");

const Chat = require("./models/user/Chat");
const WebSocket = require("ws");
var WebSocketServer = WebSocket.Server;

// the websocketServer for the chat
// const websocketServer = require("./websocketServer");

// Node module that allows to work with file and dir path
const path = require("path");
const app = express();

// connecting to mongodb
const connectDB = async () => {
  try {
    await mongoose.connect(
      // "mongodb://127.0.0.1:27017",
      "mongodb://automan:qwertyuiop1@ds115360.mlab.com:15360/startup-business-db",
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );
    console.log("mongoDB connected successfully");
  } catch (err) {
    console.error(err);
  }
};

connectDB();

// getting json from user
app.use(express.json({ extended: false }));

// all api routes
app.use("/api/loginBusiness", require("./api/business/loginBusiness"));
app.use("/api/registerBusiness", require("./api/business/registerBusiness"));
app.use("/api/availability", require("./api/business/availability"));
app.use("/api/businessinfo", require("./api/business/businessinfo"));
app.use("/api/services", require("./api/business/services"));
app.use("/reset", require("./api/reset"));

// user client api routes
app.use("/api/loginUser", require("./api/user/loginUser"));
app.use("/api/registerUser", require("./api/user/registerUser"));
app.use("/api/profile", require("./api/user/profile"));
app.use("/api/checkAvailability", require("./api/user/checkAvailability"));
app.use("/api/appointments", require("./api/user/appointments"));

// Serve a static html page for reset password
app.get("/reset/:token", function (req, res) {
  res.sendFile(path.resolve(__dirname, "api", "reset.html"));
});

// use this static code line to serve on all hosting platforms ie ubuntu on aws, google cloud
// app.use(express.static(path.join(__dirname, "client/build")));

// Serve static assets in production
// this is just for heroku which sucks
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// PORT number for Express Server and Websocket Server
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

const server = express().listen(PORT, () =>
  console.log(`Listening on ${PORT}`)
);

app.listen(PORT, HOST);
// app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

const wss = new WebSocketServer({ server });
console.log("[WebSocket] Starting WebSocket server...");

// ---------------------------- All the Websocket Server Code -----------------------
wss.on("connection", (ws, request) => {
  const clientIp = request.connection.remoteAddress;
  console.log(`[WebSocket] Client with IP ${clientIp} has connected`);

  // Broadcast to all connected clients
  ws.on("message", (message) => {
    var json = JSON.parse(message);
    // Access database here otherwise it will accese multiple time bc of amount of clients
    const checkNsave = async () => {
      if (json.message === "" || json.message === null) {
        console.log("Dont save if empty string");
        return "";
      }
      if (json.message !== "" && json.message !== null) {
        // Save the message
        const newChat = new Chat({
          business: json.businessID,
          user: json.userID,
          sender: json.sender,
          message: json.message,
        }).save();
      }
    };
    checkNsave();

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const send2Clients = async () => {
          if (json.message === "" || json.message === null) {
            var chats1 = await Chat.find({
              business: json.businessID,
              user: json.userID,
            }).sort({
              _id: -1,
            });
            var test = JSON.stringify(chats1);
            client.send(test);
            console.log("Send to clients");
          } else {
            var chats = await Chat.find({
              business: json.businessID,
              user: json.userID,
            }).sort({
              _id: -1,
            });
            var test = JSON.stringify(chats);
            console.log("3");
            client.send(test);
          }
        };
        send2Clients();
      }
    });
    console.log(`[WebSocket] Message ${message} was received`);
  });
});
