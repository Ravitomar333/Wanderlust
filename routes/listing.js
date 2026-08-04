const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

const { upload } = require("../utils/cloudinary");


const listingController = require("../controllers/listings.js");


//index + create
router.route("/")
  .get(wrapAsync(listingController.index))
  .get( wrapAsync(listingController.index))
  .post(isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  listingController.createListing)



//  NEW 
router.get("/new", isLoggedIn, listingController.renderNew);


// show + update + delete

router.route("/:id")
      .get( wrapAsync(listingController.show))
      .put( isLoggedIn, isOwner,upload.single("listing[image]"), validateListing, listingController.update)
      .delete(isLoggedIn ,isOwner,wrapAsync(listingController.deleteListing));

//EDIT 
router.get("/:id/edit", isLoggedIn, isOwner, listingController.edit);

module.exports = router;



