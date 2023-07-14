const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const port = 5000;
const mongoDB = require("./db");
mongoDB();
const JWT_SECRET = "MYNAMEISPARTHANDAMAWESOMEHEREIAM"


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", require("./Routes/userfunction"));

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Set the user information from the decoded token to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
