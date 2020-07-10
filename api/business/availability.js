const express = require("express");
const router = express.Router();
const BusinessInfo = require("../../models/business/BusinessInfo");
// const Bookings = require("../../models/business/Bookings");
const tokenBusiness = require("../../tokenBusiness");

// @route    POST api/availability
// @desc     Create or update business availability
// @access   Public
router.put("/", tokenBusiness, async (req, res) => {
  const {
    day_of_week1,
    work1,
    start_time1,
    end_time1,
    start_lunch1,
    end_lunch1,
    day_of_week2,
    work2,
    start_time2,
    end_time2,
    start_lunch2,
    end_lunch2,
    day_of_week3,
    work3,
    start_time3,
    end_time3,
    start_lunch3,
    end_lunch3,
    day_of_week4,
    work4,
    start_time4,
    end_time4,
    start_lunch4,
    end_lunch4,
    day_of_week5,
    work5,
    start_time5,
    end_time5,
    start_lunch5,
    end_lunch5,
    day_of_week6,
    work6,
    start_time6,
    end_time6,
    start_lunch6,
    end_lunch6,
    day_of_week7,
    work7,
    start_time7,
    end_time7,
    start_lunch7,
    end_lunch7,
  } = req.body;

  // Build availability object
  const businessInfoFields = {
    business: req.business.id,
  };

  const availabilityFields = {
    day_of_week1,
    work1,
    start_time1,
    end_time1,
    start_lunch1,
    end_lunch1,
    day_of_week2,
    work2,
    start_time2,
    end_time2,
    start_lunch2,
    end_lunch2,
    day_of_week3,
    work3,
    start_time3,
    end_time3,
    start_lunch3,
    end_lunch3,
    day_of_week4,
    work4,
    start_time4,
    end_time4,
    start_lunch4,
    end_lunch4,
    day_of_week5,
    work5,
    start_time5,
    end_time5,
    start_lunch5,
    end_lunch5,
    day_of_week6,
    work6,
    start_time6,
    end_time6,
    start_lunch6,
    end_lunch6,
    day_of_week7,
    work7,
    start_time7,
    end_time7,
    start_lunch7,
    end_lunch7,
  };

  // businessInfo is object above then availability is the object in the model new thing will be saved to
  businessInfoFields.availability = availabilityFields;

  try {
    let businessInfo = await BusinessInfo.findOneAndUpdate(
      { business: req.business.id },
      { $set: businessInfoFields },
      { new: true, upsert: true }
    );
    console.log(businessInfoFields);

    res.json(businessInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// export the router
module.exports = router;
