const express= require("express");
const router=express.Router();
const User = require("../Models/user.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

const wrapAsync = require("../util/wrapAsync.js");
const passport = require("passport");
const user = require("../Models/user.js");

// signup rander and handle routes
router.route("/signup")
.get((userController.renderSignupForm))
.post( wrapAsync(userController.signup))


// Route to render the signup form
// Uses the renderSignupForm method from userController
// router.get("/signup",(userController.renderSignupForm));

// Route to handle user signup
// Uses the signup method from userController
// router.post("/signup", wrapAsync(userController.signup));

// Route to render the login form
// Uses the renderLoginForm method from userController
router.get("/login",(userController.renderLoginForm) );

router.post("/log",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
userController.login
);

router.get("/logout", userController.logout);
    
module.exports=router;