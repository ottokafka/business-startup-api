// We need to check if the date and time are booked already if not forget about it
// user books a time slot
const tokenUser = require("../../tokenUser");
const tokenBusiness = require("../../tokenBusiness");
const express = require("express");
const router = express.Router();
const Business = require("../../models/business/Business");
const Appointments = require("../../models/user/Appointments");
const User = require("../../models/user/User");

// ------------------ Grab chats from db ----------------
router.post("/chats", async (req, res) => {
  const { userID, businessID } = req.body;

  var chats = await Chat.find({ business: businessID, user: userID }).select(
    "-_id"
  );
  console.log(chats);
  res.json(chats);
});

// check appointments for barber
// @route    get api/appointments/business
// @desc     Check the appointment time
// @access   Private
router.get("/business", tokenBusiness, async (req, res) => {
  try {
    // sort _id has a date embedded -1 means newest to oldest and limit means how many.
    var myAppointment = await Appointments.find({
      business: req.business.id,
    })
      .sort({
        _id: -1,
      })
      .limit(12); // Use limit only if you use find which finds many

    function isEmptyObject(obj) {
      return !Object.keys(obj).length;
    }

    if (myAppointment === null) {
      res.json([{ time: null, date: null }]);
    }
    if (isEmptyObject(myAppointment)) {
      res.json([{ time: null, date: null }]);
    } else {
      // appointment is in the db
      console.log("else");
      res.json(myAppointment);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Confirm / Accept an appointment
// @route    PUT api/appointments/business
// @desc     Create or update appointments
// @access   Private
router.put("/business", tokenBusiness, async (req, res) => {
  const { user, accept, time, date } = req.body;

  try {
    // const acceptAppointment = new Appointments({
    //   accept: accept,
    // });
    console.log(accept);
    console.log(user);

    let acceptAppointment = await Appointments.findOneAndUpdate(
      { user: user, time: time, date: date },
      { $set: { accept: accept } },
      { new: true, upsert: true }
    );
    console.log(acceptAppointment);

    //TODO: send notification to user about his booking
    var firebaseToken = await User.findById(user).select("-password");

    console.log(`user is ${user}`);
    console.log(`Firebase ${firebaseToken.firebaseToken}`);
    // convert miltary time to 12 hour am pm
    function formatAmPm(time) {
      var hours = parseInt(time);
      var minutes = 00;
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return strTime;
    }
    var timeAmPm = formatAmPm(time);
    // Notification send a predefined message to the client
    // var message = {
    //   notification: {
    //     title: "appointmentUser",
    //     body:
    //       accept == true
    //         ? `Appointment accepted at ${timeAmPm}`
    //         : `Barber is busy at  ${timeAmPm}`,
    //   },
    //   data: {
    //     title: "appointmentUser",
    //     msg:
    //       accept == true
    //         ? `Appointment accepted at ${timeAmPm}`
    //         : `Appointment rejected ${timeAmPm}`,
    //   },

    //   token: firebaseToken.firebaseToken,
    // };
    // admin
    //   .messaging()
    //   .send(message)
    //   .then((response) => {
    //     // Response is a message ID string.
    //     console.log("Successfully sent message:", response);
    //   })
    //   .catch((error) => {
    //     console.log("Error sending message:", error);
    //   });

    res.json(acceptAppointment);

    // const appointment = await acceptAppointment.save();
    // console.log(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err: err.message });
  }
});

//TODO: need to write logic that doesn't allow user to book more than three appointment a day.
// check an appointment
// @route    get api/appointments
// @desc     Check the appointment time
// @access   Private
router.get("/", tokenUser, async (req, res) => {
  try {
    // sort _id has a date embedded -1 means newest to oldest and limit means how many.
    var myAppointment = await Appointments.find({ user: req.user.id })
      .sort({
        _id: -1,
      })
      .limit(6);

    if (myAppointment === null) {
      res.json({ time: null, date: null });
    } else {
      // // Sort appointments from soonest to lastest
      // myAppointment.sort(function (b, a) {
      //   a = new Date(a.date);
      //   b = new Date(b.date);
      //   return a > b ? -1 : a < b ? 1 : 0;
      // });
      // appointment is in the db
      res.json(myAppointment);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Book an appointment
// @route    PUT api/appointments
// @desc     Create or update appointments
// @access   Private
router.put("/", tokenUser, async (req, res) => {
  const {
    from,
    business,
    userName,
    company,
    address,
    city,
    state,
    date,
  } = req.body;

  // // in the date I need year month and day 2020-05-11
  // let date_ob = new Date();
  // let year = date_ob.getFullYear();
  // let date = ("0" + date_ob.getDate()).slice(-2);
  // let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  try {
    // search db and find by business to get the firebaseToken associated with business
    var firebaseToken = await Business.findById(business).select("-password");

    const newAppointment = new Appointments({
      user: req.user.id,
      business: business,
      company: company,
      userName: userName,
      address: address,
      city: city,
      state: state,
      time: from,
      date: date,
      accept: null,
    });
    console.log(newAppointment);

    // Save the appointment
    const appointment = await newAppointment.save();

    // Convert time to 12 am pm
    function formatAmPm(time) {
      var hours = parseInt(time);
      var minutes = 00;
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return strTime;
    }
    var timeAmPm = formatAmPm(from);
    // Notification send a predefined message to the client
    // var message = {
    //   notification: {
    //     title: "appointmentBusiness",
    //     body: `A client wants a haircut at ${timeAmPm}`,
    //   },
    //   data: {
    //     title: "appointmentBusiness",
    //     msg: `A client is waiting for you to accept his booking for ${timeAmPm}`,
    //   },

    //   token: firebaseToken.firebaseToken,
    // };
    // admin
    //   .messaging()
    //   .send(message)
    //   .then((response) => {
    //     // Response is a message ID string.
    //     console.log("client book appointment:", response);
    //   })
    //   .catch((error) => {
    //     console.log("Error sending message:", error);
    //   });

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// export the router
module.exports = router;
