const express= require("express");
const router=express.Router();
const Listing=require("../Models/listing.js");
const {isloggedIn, isOwner,validateReview}=require("../middleware.js");
const { listingSchema } = require('../Schema.js');
const listingController = require("../controllers/listings.js");
const wrapAsync = require("../util/wrapAsync.js");
const multer  = require('multer')
const { storage } = require('../cloudconfig.js');
const upload = multer({ storage})

// compact router by router.route //index route // create a new route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isloggedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing));



// new form route
// This route will render the form to create a new listing
router.get("/new",isloggedIn,listingController.renderNewForm);

// show delete update route
router.route("/:id")
.get(listingController.showListing)
.put(isloggedIn,isOwner,upload.single('listing[image]'),wrapAsync(listingController.createListing))
.delete(isloggedIn,isOwner,wrapAsync(listingController.destroyListing));

// edit route
router.get("/:id/edit",isloggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;
