const dotenv = require('dotenv/config')
require('dotenv').config()
console.log(process.env)
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

app.use("/",require('./Routes/userfunction'))
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })