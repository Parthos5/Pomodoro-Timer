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
app.use("/", require("./Routes/tasks"))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
