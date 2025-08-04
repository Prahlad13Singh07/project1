const express= require("express");
const router=express.Router({mergeParams: true});
const {reviewSchema}=require("../Schema.js");
const ExpressError = require('../util/Error.js');
const review=require("../Models/review.js");
const Listing=require("../Models/listing.js");
// const {validateReview}=require("../middleware.js");
const {isloggedIn, isOwner,validateReview, isreviewAuther}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");
const wrapAsync=require("../util/wrapAsync.js");


//  review post route
router.post("/",isloggedIn,validateReview,wrapAsync(reviewController.createReview));

// delete review route
router.delete("/:reviewId",isloggedIn,isreviewAuther,wrapAsync(reviewController.destroyReview));

module.exports=router;
