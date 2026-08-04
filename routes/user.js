const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");

//  SIGNUP 
router.route("/signup")
      .get( userController.rendersignUp)
      .post( userController.signUp );

//  LOGIN 

router.route("/login")
.get( userController.renderLogin)
.post( saveRedirectUrl, userController.login);

      
// LOGOUT 

router.get("/logout",userController.logout);

module.exports = router;
