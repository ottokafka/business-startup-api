const express = require("express");
const router = express.Router();
var crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const config = require("config");
const { check, validationResult } = require("express-validator");
const tokenUser = require("../../tokenUser");
const User = require("../../models/user/User");

// @route    GET api/user
// @desc     Get business by tokenUser
// @access   Private
router.get("/", tokenUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/user/loginUser
// @desc     Login client
// @access   Public
router.post("/loginUser", async (req, res) => {
  const { email, password } = req.body;

  // console.log(email, password);

  try {
    // search db for email

    let user = await User.findOne({ email });

    console.log(user);

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    // give jwt to client
    jwt.sign(
      payload,
      "gateway",
      {
        expiresIn: 3600000
      },
      (err, tokenUser) => {
        if (err) throw err;
        res.json({ tokenUser });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.json("server error");
  }
});

module.exports = router;
