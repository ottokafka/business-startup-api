const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/user/User");

// @route    POST api/registerUser
// @desc     Register user
// @access   Public
router.post(
  "/",
  // [
  //   check("name", "Name is required")
  //     .not()
  //     .isEmpty(),
  //   check("email", "Please include a valid email").isEmail(),
  //   check(
  //     "password",
  //     "Please enter a password with 6 or more characters"
  //   ).isLength({ min: 6 })
  // ],
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    const { name, email, password, firebaseToken } = req.body;
    console.log(email);


    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        password,
        firebaseToken
      });
      console.log(firebaseToken);


      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      // give jwt to user
      jwt.sign(
        payload,
        "gateway",
        {
          expiresIn: 9999999999
        },
        (err, tokenUser) => {
          if (err) throw err;
          res.json({ tokenUser });
        }
      );
    } catch (err) {
      console.log("server error" + err);
      res.json("server error");
    }
  }
);

module.exports = router;
