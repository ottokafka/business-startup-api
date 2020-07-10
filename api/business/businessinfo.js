const express = require("express");
const router = express.Router();
const BusinessInfo = require("../../models/business/BusinessInfo");
const Business = require("../../models/business/Business");
const tokenBusiness = require("../../tokenBusiness");
const tokenUser = require("../../tokenUser");
const https = require('https');
const axios = require('axios');

// @route    GET api/businessinfo/me
// @desc     Get current users business
// @access   Private
router.get("/me", tokenBusiness, async (req, res) => {
  try {
    const businessInfo = await BusinessInfo.findOne({
      business: req.business.id,
    }).populate("business", ["firstName", "lastName", "email", "phoneNumber"]);

    // console.log(businessInfo);

    if (!businessInfo) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(businessInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/businessinfo/business/:id
// @desc     get business info by business id
// @access   Public
router.get("/business/:business_id", async (req, res) => {
  try {
    // in find req.params - this grabs the :id and searches db for it
    var businesID = req.params.business_id
    const businesses = await BusinessInfo.findOne({
      business: businesID,
    });
    res.json(businesses);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Post not found" });
  }
});

// @route    POST api/businessinfo
// @desc     Create or update business info
// @access   Private
router.post("/", tokenBusiness, async (req, res) => {
  const { company, address, city, state, zip } = req.body;

  const businessInfoFields = {
    business: req.business.id,
    company,
  };

  const locationFields = {
    address,
    city,
    state,
    zip,
  };

  businessInfoFields.location = locationFields;

  // TODO: check database if user has already filled out availablility if yes dont use this below
  // Post some empty data for availability
  const availabilityFields = {
    day_of_week1: "monday",
    work1: false,
    start_time1: "",
    end_time1: "",
    day_of_week2: "",
    work2: false,
    start_time2: "",
    end_time2: "",
    day_of_week3: "",
    work3: false,
    start_time3: "",
    end_time3: "",
    day_of_week4: "",
    work4: false,
    start_time4: "",
    end_time4: "",
    day_of_week5: "",
    work5: false,
    start_time5: "",
    end_time5: "",
    day_of_week6: "",
    work6: false,
    start_time6: "",
    end_time6: "",
    day_of_week7: "",
    work7: false,
    start_time7: "",
    end_time7: "",
  };

  try {
    // Runs only once - Saves availability and locaiton
    let checkAvailability = await BusinessInfo.findOne({ business: req.business.id });
    console.log(checkAvailability);

    if (checkAvailability === null) {
      console.log("save availablity");
      businessInfoFields.availability = availabilityFields;
      var businessInfo = await BusinessInfo.findOneAndUpdate(
        { business: req.business.id },
        { $set: businessInfoFields },
        { new: true, upsert: true }
      );
      res.json(businessInfo);
      // save availability
    } else {
      // Using upsert option (creates new doc if no match is found):
      var businessInfo = await BusinessInfo.findOneAndUpdate(
        { business: req.business.id },
        { $set: businessInfoFields },
        { new: true, upsert: true }
      );

      res.json(businessInfo);
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/businessinfo/all
// @desc     gets all the businesses in the db
// @access   Public
router.get("/all", async (req, res) => {
  try {
    const businesses = await BusinessInfo.find().populate("business", [
      "firstName",
      "email",
      "phoneNumber",
    ]);
    // console.log(businesses);

    const availability = await BusinessInfo.find();
    // console.log(availability);

    res.json({ AllBusiness: businesses, AllAvailabiltiy: availability });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/businessinfo/:id
// @desc     get business info by business id
// @access   Public
router.get("/business/:business_id", async (req, res) => {
  try {
    // in find req.params - this grabs the :id and searches db for it
    const businesses = await BusinessInfo.findOne({
      business: req.params.business_id,
    });
    res.json(businesses);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Post not found" });
  }
});

// @route    DELETE api/businessinfo/:id
// @desc     Delete business, and availability and services
// @access   Private
router.delete("/", tokenBusiness, async (req, res) => {
  try {
    // Remove user posts
    await BusinessInfo.deleteMany({ business: req.business.id });
    // Remove profile
    await BusinessInfo.findOneAndRemove({ business: req.business.id });
    // Remove user
    await Business.findOneAndRemove({ _id: req.business.id });

    res.json({ msg: "Business removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/businessinfo/zip
// @desc     search all business by zip code
// @access   public
router.post("/zip", tokenUser, async (req, res) => {
  const { zip } = req.body;
  // console.log(zip);

  try {
    let businessInfo = await BusinessInfo.find({ "location.zip": zip });
    res.json(businessInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/businessinfo/city
// @desc     search all business by city name
// @access   public
router.get("/city", async (req, res) => {
  let apiKey = "AIzaSyA991qIAUlwEuAzM1K1rmNa7hI4bl5c6O4"
  let googleMaps = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial"

  try {
    let businessInfo = await BusinessInfo.find({
      "location.city": "sacramento",
    })

    async function getDistance2() {
      // first loop to pull the streets from the database
      let streets = []
      for (let index = 0; index < businessInfo.length; index++) {
        const element = businessInfo[index];
        let streetAddress = element.location.address;
        streets.push(streetAddress)
      }

      let d0 = streets[0] !== undefined ? `|Sacramento+${streets[0]},CA` : null
      let d1 = streets[1] !== undefined ? `|Sacramento+${streets[1]},CA` : null
      let d2 = streets[2] !== undefined ? `|Sacramento+${streets[2]},CA` : null
      let d3 = streets[3] !== undefined ? `|Sacramento+${streets[3]},CA` : null
      let d4 = streets[4] !== undefined ? `|Sacramento+${streets[4]},CA` : null
      let d5 = streets[5] !== undefined ? `|Sacramento+${streets[5]},CA` : null
      let d6 = streets[6] !== undefined ? `|Sacramento+${streets[6]},CA` : null
      let d7 = streets[7] !== undefined ? `|Sacramento+${streets[7]},CA` : null
      let d8 = streets[8] !== undefined ? `|Sacramento+${streets[8]},CA` : null
      let d9 = streets[9] !== undefined ? `|Sacramento+${streets[9]},CA` : null
      let d10 = streets[10] !== undefined ? `|Sacramento+${streets[10]},CA` : null
      let d11 = streets[11] !== undefined ? `|Sacramento+${streets[11]},CA` : null
      let d12 = streets[12] !== undefined ? `|Sacramento+${streets[12]},CA` : null
      let d13 = streets[13] !== undefined ? `|Sacramento+${streets[13]},CA` : null
      let d14 = streets[14] !== undefined ? `|Sacramento+${streets[14]},CA` : null
      let d15 = streets[15] !== undefined ? `|Sacramento+${streets[15]},CA` : null
      let d16 = streets[16] !== undefined ? `|Sacramento+${streets[16]},CA` : null
      let d17 = streets[17] !== undefined ? `|Sacramento+${streets[17]},CA` : null
      let d18 = streets[18] !== undefined ? `|Sacramento+${streets[18]},CA` : null
      let d19 = streets[19] !== undefined ? `|Sacramento+${streets[19]},CA` : null
      let d20 = streets[20] !== undefined ? `|Sacramento+${streets[20]},CA` : null
      let d21 = streets[21] !== undefined ? `|Sacramento+${streets[21]},CA` : null

      let origins = "Sacramento,CA"
      // let destinations = `${d0}${d1}${destination2}${destination3}${destination4}${destination5}${destination6}${destination7}${destination8}${destination9}${destination10}${destination11}${destination12}${destination13}${destination14}${destination15}${destination16}${destination17}`
      let destinations = d0 + d1 + d2 + d3 + d4 + d5 + d6 + d7 + d8 + d9 + d10 + d11 + d12 + d13 + d14 + d15 + d16 + d17 + d18 + d19 + d20 + d21
      var url = `${googleMaps}&destinations=${destinations}&origins=${origins}&key=${apiKey}`;

      try {
        const response = await axios.get(url);
        var tElements = response.data.rows[0].elements

        for (let index = 0; index < tElements.length; index++) {
          var miles = response.data.rows[0].elements[index].distance.text
          console.log(miles);
          businessInfo[index]["location"]["distance"] = miles
        }
        // Sort from nearest to Furthest
        businessInfo.sort(function (a, b) {
          return parseFloat(a.location.distance) - parseFloat(b.location.distance);
        });
      } catch (error) {
        console.error(error);
      }
      return
    }

    // await getDistance();
    await getDistance2();
    console.log('get Distance, I\'m done!');
    // sorting function from Closest to farthest

    res.json(businessInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/businessinfo/city
// @desc     search all business by city name
// @access   public
router.post("/city", async (req, res) => {
  const { city } = req.body;

  try {
    let businessInfo = await BusinessInfo.find({
      "location.city": city,
    }).limit(10);
    // res.json(businessInfo);
    // example Date [{company, address, city, etc..},{company, address, city, etc..}]
    //TODO: use address and city to get distance
    console.log(businessInfo);


  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// export the router
module.exports = router;
