const Listing = require('../Models/listing');
const review = require('../Models/review');


// createReview function to handle creating a new review for a listing
module.exports.createReview = async(req,res)=>{
    // console.log(req.params.id);
    listing=await Listing.findById(req.params.id);
    console.log("Form body ===>", req.body);
    let newReview=new review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("review was saved");
    req.flash("success","Successfully created a new review!");
    res.redirect(`/listings/${listing._id}`);
};

// deleteReview function to handle deleting a review
module.exports.destroyReview = async(req,res)=>{
    const {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success","Successfully deleted the review!");
    res.redirect(`/listings/${id}`);
};