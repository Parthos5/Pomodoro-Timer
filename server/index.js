const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const port = 5000
const app = express();

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })