const User = require("../Models/user.js");

// render the signup form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


// Handle user signup
module.exports.signup = async(req, res) => {
    try {let{username,email,Password}=req.body;
    const newUser= new User({username, email});
    const registeredUser=await User.register(newUser, Password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Welcome to the app!");
        res.redirect("/listings");
    });
} catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
}
};

// Handle user login
module.exports.login = async(req, res, next) => {
    req.flash("success","wellcome to wonderlust back ");
    redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
    console.log("login success");       
}

// Handle user logout
module.exports.logout = (req, res,next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    });
};