require('dotenv').config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const client_id = process.env.CLIENT_ID;

router.post("/getCred", async (req, res) => {
    console.log(JWT_SECRET)
  let { authToken } = req.body;
  if (!authToken) {
    return res.status(400).json({ error: "No auth token found" });
  }
  const decoded = await jwt.verify(authToken, JWT_SECRET);
  if (!decoded) {
    res.status(400).json({ Error: "Auth token not verified" });
  }

  return res.status(200).json({redirect_uri:redirectUri,client_id:client_id});
});

module.exports = router;
