const express = require('express');
const app = express();
// const mongoose = require('mongoose');
const cors = require('cors');
const port = 5000
const mongoDB = require('./db');
mongoDB();

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api",require('./Routes/userfunction'))
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })