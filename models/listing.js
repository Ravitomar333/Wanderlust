const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const imageSchema = new mongoose.Schema({
  url: String,
});

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: {
    url: String,
    filename: String,
  },


  price: Number,
  location: String,
  country: String,

   category: {
    type: String,
    enum: [
      "Trending",
      "Rooms",
      "Iconic",
      "Mountains",
      "Castle",
      "Pools",
      "Camping",
      "Farms",
      "Arctic",
      "Domes",
      "Boats"
    ]
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
