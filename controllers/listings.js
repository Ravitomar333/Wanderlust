const Listing = require("../models/listing");
const { cloudinary } = require("../utils/cloudinary");
//index

module.exports.index = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.location = { $regex: search, $options: "i" };
    }

    const listings = await Listing.find(filter);

    res.render("listings/index", { listings, category, search });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error loading listings");
  }
};


// new

module.exports.renderNew = (req, res) => {
  res.render("listings/new");
};

//create
module.exports.createListing = async (req, res) => {

  const listing = new Listing(req.body.listing);

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  listing.owner = req.user._id;
  await listing.save();

  req.flash("success", "New listing created!");
  res.redirect(`/listings/${listing._id}`);
};


// show a listing

module.exports.show = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id)
      .populate("owner")
      .populate({
        path: "reviews",
        populate: { path: "owner" },
      });

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
  } catch (err) {
    console.log(err);
    res.redirect("/listings");
  }
};

// edit
module.exports.edit = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  res.render("listings/edit", {
    listing,
    originalImageUrl: listing.image?.url,
  });
};


module.exports.update = async (req, res) => {
  const { id } = req.params;

 
  const listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  
  if (req.file) {

 
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

   
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };

    await listing.save();
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${listing._id}`);
};


//delete

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  
  if (listing.image && listing.image.filename) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
