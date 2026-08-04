const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

// ===================== AUTH =====================

// User must be logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first");
    return res.redirect("/login");
  }
  next();
};

// Save redirect URL after login
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// ===================== OWNERSHIP =====================

// Listing owner check
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

// Review author check
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.owner.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

// ===================== VALIDATION =====================

// Listing validation
// module.exports.validateListing = (req, res, next) => {
//   const { error } = listingSchema.validate(req.body);

//   if (error) {
//     const errMsg = error.details.map(el => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   }

//   next();
// };
// module.exports.validateListing = (req, res, next) => {

  
//   if (req.file) {
//     req.body.listing.image = {
//       url: req.file.path,
//     };
//   }

//   const { error } = listingSchema.validate(req.body);

//   if (error) {
//     const errMsg = error.details.map(el => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   }

//   next();
// };
module.exports.validateListing = (req, res, next) => {

  // Ensure listing object exists
  if (!req.body.listing) {
    throw new ExpressError("Invalid listing data", 400);
  }

  // DO NOT mutate req.body here (controller responsibility)
  const { error } = listingSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(errMsg, 400);
  }

  next();
};



// Review validation
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    req.flash("err",errMsg)
   // throw new ExpressError(400, errMsg);
   return res.redirect("back")
  }

  next();
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in first");
    return res.redirect("/login");
  }
  next();
};
