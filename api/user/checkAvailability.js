const express = require("express");
const router = express.Router();
// const BusinessInfo = require("../../models/business/BusinessInfo");
// const Bookings = require("../../models/business/Bookings");
const tokenUser = require("../../tokenUser");
const { create1hour } = require("./create1hour");

// Check availability is going to check the business availability his input in time and then it will convert those times into 30 minute increments and displayed that to the user
// @route    GET api/checkAvailability
// @desc     check availability
// @access   Public
// get a example business id from db
router.get("/:business_id", async (req, res) => {
  // find by business id
  var businessID = req.params.business_id;
  console.log("businessID", businessID);

  const business = await BusinessInfo.findOne({
    business: businessID,
  }).populate("business", ["firstName", "lastName"]);

  if (!business) {
    return res.json("no business with that id");
  }

  // var date = new Date();
  // // in the date I need year month and day 2020-05-11
  // var todaysYear = date.getFullYear();
  // var todaysMonth = date.getMonth();
  // // getDay() create 1 or 2 or 3 etc. which reps monday 1 tuesday 2 etc..

  // var theDate = date.getDate();
  let date_ob = new Date();
  var dayOfWeek = date_ob.getDay() + 1;
  console.log(dayOfWeek);

  let year = date_ob.getFullYear();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // The boys to book today so get the date and make that time first.
  // If work is true then create 30 minute intervals if not skip it
  var data = business.availability;
  // 1 means monday and 2 means tuesday etc...
  // get today date availability
  if (dayOfWeek === 1) {
    // TODO: if today is not available then so work1 is false then
    // this is only shown if monday was available
    if (data.work1 === true) {
      var timeField = {
        timeSlots: await create1hour(
          data.start_time1,
          data.end_time1,
          `${year}-${month}-${date}`,
          businessID
        ),
      };

      return res.json(timeField);
    } else {
      return res.json({ timeSlots: { from: [] } });
    }
  } else if (dayOfWeek === 2) {
    // today is tuesday
    console.log("today is tuesday");

    if (data.work2 === true) {
      var timeField = {
        timeSlots: await create1hour(
          data.start_time2,
          data.end_time2,
          `${year}-${month}-${date}`,
          businessID
        ),
      };

      return res.json(timeField);
    } else {
      return res.json({ timeSlots: { from: [] } });
    }
  } else if (dayOfWeek === 3) {
    // today is wednesday
    if (data.work3 === true) {
      var timeField = {
        timeSlots: await create1hour(
          data.start_time3,
          data.end_time3,
          `${year}-${month}-${date}`,
          businessID
        ),
      };

      return res.json(timeField);
    } else {
      return res.json({ timeSlots: { from: [] } });
    }
  } else if (dayOfWeek === 4) {
    // today is thursday
    if (data.work4 === true) {
      var timeField = {
        timeSlots: await create1hour(
          data.start_time4,
          data.end_time4,
          `${year}-${month}-${date}`,
          businessID
        ),
      };

      return res.status(200).json(timeField);
    } else {
      return res.json({ timeSlots: { from: [] } });
    }
  } else if (dayOfWeek === 5) {
    // today is friday
    if (data.work5 === true) {
      var timeField = {
        timeSlots: await create1hour(
          data.start_time5,
          data.end_time5,
          `${year}-${month}-${date}`,
          businessID
        ),
      };

      return res.json(timeField);
    } else {
      return res.json({ timeSlots: { from: [] } });
    }
  } else if (dayOfWeek === 6) {
    // today is saturday
    if (data.work6 === true) {
      var timeField = {
        timeSlots: await create1hour(
          data.start_time6,
          data.end_time6,
          `${year}-${month}-${date}`,
          businessID
        ),
      };

      return res.json(timeField);
    } else {
      return res.json({ timeSlots: { from: [] } });
    }
  } else if (dayOfWeek === 7) {
    // today is sunday
    if (data.work7 === true) {
      var timeField = {
        timeSlots: await create1hour(
          data.start_time7,
          data.end_time7,
          `${year}-${month}-${date}`,
          businessID
        ),
      };

      return res.json(timeField);
    } else {
      return res.json({ timeSlots: { from: [] } });
    }
  }

  try {
    // This check the BusinessInfo model for availability

    res.json(business);

    // res.json(bookings);
    // console.log(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// export the router
module.exports = router;
