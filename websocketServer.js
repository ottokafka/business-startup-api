const WebSocket = require("ws");
const Chat = require("./models/user/Chat");

// start the server and specify the port number
const wss = new WebSocket.Server({ port: 8080 });
console.log("[WebSocket] Starting WebSocket server...");

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
    //  send msg to User: Run the api route when msg is recieved and save to mongodb and send notification through firebase
  });

  // ws.on("close", function () {
  //   closeSocket();
  // });
  // process.on("SIGINT", function () {
  //   console.log("Closing things");
  //   closeSocket("Server has disconnected");
  //   process.exit();
  // });
});
