const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://surendrasaluru:surendrad2731@namastenode.ciha5.mongodb.net/devwave"
  );
};

module.exports = connectDB;

//mongodb+srv://surendrasaluru:<db_password>@namastenode.ciha5.mongodb.net/?retryWrites=true&w=majority&appName=Namastenode
