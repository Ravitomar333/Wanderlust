const User = require("../models/user");
const passport = require("passport");

module.exports.rendersignUp = (req, res) => {
  res.render("users/signup");
}

module.exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);

   
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings/new");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};


//login render
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res, next) => {
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, () => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  });
};

//logout

module.exports.logout =  (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully");
    res.redirect("/listings");
  });
};