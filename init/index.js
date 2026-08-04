const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const mongo_URL = process.env.MONGO_URL;

main()
  .then(() => {
    console.log("✅ Connected to DB");
    initDB(); 
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_URL);
};

const initDB = async () => {
  await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj) => ({...obj, owner: "693d7e8e4ab8502735896c75"}))
  await Listing.insertMany(initdata.data);  
  console.log(" Data was initialized");
};

initDB();