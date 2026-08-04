require("dotenv").config();



const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");


const flash = require("connect-flash");
const dbUrl=process.env.ATLASDB_URL;

const { MongoStore } = require("connect-mongo");


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600, // 24 hours
});



store.on("error",()=>{
  console.log("ERROR in Mongo Session Store")
});

app.use(
  session({
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);




app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null;
  next();
});




// DATABASE
mongoose
  .connect(dbUrl)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err));

// VIEW ENGINE
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MIDDLEWARE (ORDER MATTERS)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


app.use((req, res, next) => {
  res.locals.currUser = req.user || null;
  next();
});

// ROUTES
const userRoutes = require("./routes/user");
app.use("/", userRoutes);
const listingRoutes = require("./routes/listing");
app.use("/listings", listingRoutes);
const reviewsRoutes = require("./routes/review");
app.use("/listings/:id/reviews", reviewsRoutes);


// multer 
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    req.flash("error", "Image size must be less than 2MB");
    return res.redirect("/listings/new");
  }

  if (err.message === "Only image files are allowed") {
    req.flash("error", err.message);
    return res.redirect("/listings/new");
  }

  next(err);
});



// ROOT
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// SERVER
app.listen(8080, () => {
  console.log("🚀 Server running on port 8080");
});
