const express = require("express");
const router = express.Router();
const Business = require("../../models/business/Business");
const jwt = require("jsonwebtoken");

//TODO: add validation authentication check email phone number
// @route    POST api/registerBusiness
// @desc     Register business
// @access   Public
router.post("/", async (req, res) => {
  // need a model to refer to for the client and the business sign up

  const { firstName, lastName, email, password, phoneNumber, firebaseToken } = req.body;

  try {
    // search db for email
    let findEmail = await Business.findOne({ email });

    if (findEmail) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    business = new Business({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      firebaseToken
    });

    console.log(firstName, lastName, email, password, phoneNumber, firebaseToken);

    // Save to the db
    await business.save();

    // give jwt to business
    jwt.sign(
      { business: { id: business.id } },
      "gateway",
      {
        expiresIn: 9999999999
      },
      (err, tokenBusiness) => {
        if (err) throw err;
        res.json({ tokenBusiness });
      }
    );
  } catch (err) {
    console.log(err);
    console.log("server error");
    res.json("server error");
  }
});

// export the router
module.exports = router;
