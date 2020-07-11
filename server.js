const express = require("express");
const mongoose = require("mongoose");

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

app.listen(PORT, HOST);
// app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
