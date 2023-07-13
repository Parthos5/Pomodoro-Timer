const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {
  query,
  body,
  matchedData,
  validationResult,
} = require("express-validator");

router.post(
  "/register",
  body("email", "Please enter a valid Email ID").isEmail(),
  body("password", "Password should be minimum 5 characters").isLength({
    min: 5,
  }),
  body("name", "Name should be minimum 3 characters").isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, password } = req.body;
    try {
      if (!email || !password || !name) {
        res.status(400).json({ Error: "Missing Credentials" });
      } else {
        await User.create({
          email: email,
          password: password,
          name: name,
        });
        res.status(400).json({ message: "Success,User Created!" });
      }
    } catch (err) {
      res.status(500).json({ Error: err });
    }
  }
);

router.post(
  "/login",
  body("email", "Please enter a valid Email ID").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    // console.log(req.body)
    const { email, password } = req.body;
    console.log(email);
    console.log(password);

    if (!email || !password) {
      res.status(400).json({ Error: "Missing credentials" });
    }

    try {
      const userData = await User.findOne({ email: email });
      console.log(userData);

      // if(userData){
      //     res.status(200).json({userdata:userData})
      // }
      // else{
      //     res.status(200).json({success:false})
      // }
      if (!userData) {
        res.status(400).json({ Error: "Email not registered", status: 201 });
      } else {
        if (userData.password == password) {
          res
            .status(200)
            .json({ message: "Logged in successfully", status: 200 });
        } else {
          res.status(200).json({ message: "Incorrect Password", status: 202 });
        }
      }
    } catch (err) {
      res.status(500).json({ Error: err });
    }
  }
);

router.get("/register", async (req, res) => {
  res.status(200).json({ hi: "ho" });
});

module.exports = router;
