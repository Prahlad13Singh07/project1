if(process.env.NODE_ENV != 'production') {
require('dotenv').config();
}
// console.log(process.env.SECRET);
// const session = require('express-session');

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./Models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const review=require("./Models/review.js");
const {listingSchema,reviewSchema}=require("./Schema.js");
const ExpressError = require('./util/Error.js');
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./Models/user.js');
const wrapAsync = require("./util/wrapAsync");

const reviewwRouter=require("./routess/revieww.js");
const listingRouter=require("./routess/listing.js");
const userRouter=require("./routess/user.js");
const cookieParser = require("cookie-parser");

const dbUrl = process.env.ATLAS_URL;

async function main(){
    await mongoose.connect(dbUrl);
};

main()
.then(()=>{
    console.log("connect to db");
}).catch((err)=>{
    console.log(err);
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600, // time period in seconds
    crypto: {
        secret:process.env.SECRET// Use your secret key from .env
    }
});

store.on("error", function(e) {
    console.log("Session store error", e);
});

const sessionOptions={
    store: store,
    secret: process.env.SECRET, // Use your secret key from .env
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24*7, // 1 day
        maxAge: 1000 * 60 * 60 * 24*7,// 1 day
    }
};

// app.get("/",(req,res)=>{
//     res.send("hi i am root");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    console.log(res.locals.success);
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewwRouter);
app.use("/",userRouter);

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(errMsg,400);
    }else{
        next();
    }
}

app.listen(8080,()=>{
    console.log("server is listening port 8080");
});