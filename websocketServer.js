const WebSocket = require("ws");
const Business = require("./models/business/Business");
const BusinessInfo = require("./models/business/BusinessInfo");
const User = require("./models/user/User");
const Chat = require("./models/user/Chat");

// // This is intialize firebase we only need to call it once in the main server

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

    // const sendNotification = async () => {
    //     if (json.message === '' || json.message === null) {
    //         console.log("Dont send notification if empty string");
    //     } else {
    //         // if the sender is a business then send user a notification
    //         if (json.sender === "business") {
    //             var user = await User.findById(json.userID).select("-password");
    //             var business = await Business.findById(json.businessID).select("-password");
    //             var businessInfo = await BusinessInfo.findOne({ business: json.businessID });

    //             // console.log(businessInfo);
    //             console.log("from business to User");
    //             var myNotification = {
    //                 token: user.firebaseToken,
    //                 notification: {
    //                     title: "chatBusiness",
    //                     body: `${businessInfo.company} wrote: ${json.message}`,
    //                 },
    //                 data: {
    //                     title: "chatBusiness",
    //                     msg: `${json.message}`,
    //                     // send business id to user to auto start chat screen
    //                     businessID: json.businessID,
    //                     business: `${businessInfo.company}`
    //                 },
    //             }
    //             admin
    //                 .messaging()
    //                 .send(myNotification)
    //                 .then((response) => {
    //                     console.log("Successfully sent message:", response);
    //                 })
    //                 .catch((error) => {
    //                     console.log("Error sending message:", error);
    //                 });

    //         } else {
    //             // -------- Notifications from user to business from firebase cloud ------------
    //             var firebaseToken = await Business.findById(json.businessID).select("-password");
    //             var user = await User.findById(json.userID).select("-password");
    //             // console.log(firebaseToken);
    //             console.log("from user to  Business");

    //             var myNotification = {
    //                 token: firebaseToken.firebaseToken,
    //                 notification: {
    //                     title: "chatUser",
    //                     body: json.message,
    //                 },
    //                 data: {
    //                     title: "chatUser",
    //                     msg: `${json.message}`,
    //                     // Send user id to the business
    //                     userID: `${json.userID}`,
    //                     userName: `${user.name}`
    //                 },
    //             }
    //             admin
    //                 .messaging()
    //                 .send(myNotification)
    //                 .then((response) => {
    //                     console.log("Successfully sent message:", response);
    //                 })
    //                 .catch((error) => {
    //                     console.log("Error sending message:", error);
    //                 });
    //         }
    // }

    // }
    // sendNotification();

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
    // -------- Notifications from Business to user from firebase cloud------------
  });

  // ws.on('close', function () {
  //     closeSocket();
  // });
  // process.on('SIGINT', function () {
  //     console.log("Closing things");
  //     closeSocket('Server has disconnected');
  //     process.exit();
  // });
});
