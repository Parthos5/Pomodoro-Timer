const mongoose = require("mongoose");
const mongoUri =
  "mongodb+srv://parth:parth@cluster0.hnjeawt.mongodb.net/Balance?retryWrites=true&w=majority";

const MongoDB = async () => {
  await mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to DB successfully!");
      const fetched_data = mongoose.connection.db.collection("User"); //this command stores the data of a particular collection
      fetched_data
        .find({})
        .toArray()
        .then(function (err, data) {
          err ? console.log(err) : console.log(data);
        });
    })
    .catch((err) => console.log("Error:" + err));
};

module.exports = MongoDB;