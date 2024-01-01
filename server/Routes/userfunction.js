const express = require("express");
const router = express.Router();
const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const JWT_SECRET = "MYNAMEISPARTHANDAMAWESOMEHEREIAM";
const {
  query,
  body,
  matchedData,
  validationResult,
} = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JWT_SECRET = "MYNAMEISPARTHANDAMAWESOMEHEREIAM";

router.post("/register",
  body("email", "Please enter a valid Email ID").isEmail(),
  body("password", "Password should be minimum 5 characters").isLength({
    min: 5,
  }),
  body("name", "Name should be minimum 3 characters").isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, password } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ Error: "Missing Credentials" });
    }

    //adding bcrypt hash funtionality
    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(password, salt);
    try {
      await User.create({
        email: email,
        password: secPassword,
        name: name,
      });
      res.status(200).json({ message: "Success,User Created!" });
    } catch (err) {
      res.status(500).json({ Error: err });
    }
  }
);

router.post("/login",
  body("email", "Please enter a valid Email ID").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    // console.log(req.body)
    const { email, password, remember } = req.body;
    console.log(email);
    console.log(password);

    if (!email || !password) {
      res.status(400).json({ Error: "Missing credentials" });
    }

    try {
      const userData = await User.findOne({ email: email });
      console.log(userData);

      if (!userData) {
        res.status(400).json({ errors: "Email not registered" });
      } else {
        const data = remember
          ? {
              user: {
                id: userData._id,
                remember: true,
              },
            }
          : {
              user: {
                id: userData._id,
                remember: false,
              },
            };
        const authToken = jwt.sign(data, JWT_SECRET);
        const pwd = await bcrypt.compare(password, userData.password);
        console.log(pwd)
        if (pwd) {
          res.status(200).json({
            status: 200,
            message: "Logged in successfully",
            authToken: authToken,
          });
        } else {
          res.status(400).json({
            status: 400,
            message: "Incorrect Password",
            status: 202,
          });
        }
      }
    } catch (err) {
      res.status(500).json({ errors: err });
    }
  }
);

router.get("/verifyToken", async (req, res) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const [bearer, token] = authHeader.split(" ");
  if (!token) {
    return res
      .status(400)
      .json({ error: 400, message: "Access denied. No token provided." });
  }

  try {
    const decoded = await jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Set the user information from the decoded token to the request object
    console.log(decoded.user.remember);
    res.status(200).json({
      status: 200,
      message: "Verified User",
      remember: decoded.user.remember ? true : false,
    });
  } catch (error) {
    return res.status(401).json({ status: 400, message: "Invalid token." });
  }
});

router.post("/getUser", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ error: "JWT token is missing" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userInfo = decoded.user;

    const user = await User.findOne({ _id: userInfo.id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ User: user });
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/getStreaks",async (req,res) => {
  const {authToken} = req.body;
  try {

    if (!authToken) {
      return res.status(401).json({ error: "JWT token is missing" });
    }

    const decoded = jwt.verify(authToken, JWT_SECRET);
    const userInfo = decoded.user;

    const user = await User.findOne({ _id: userInfo.id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ Email:user.email,Streaks: user.streaks });
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

router.post("/setStreaks",async (req,res) => {
  const {authToken} = req.body;

  
})


module.exports = router;
