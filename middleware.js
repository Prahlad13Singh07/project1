const Listing = require("./Models/listing");
const Review = require("./Models/review.js");
const {listingSchema,reviewSchema}=require("./Schema.js");
const ExpressError = require('./util/Error.js');

module.exports.isloggedIn = (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        console.log(req.session.redirectUrl);
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl= (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;        
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    const { id } = req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)){
        req.flash("error","You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateReview=(req,res,next)=>{
        let {error}=reviewSchema.validate(req.body);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(errMsg,400);
        }else{
            next();
        }
    }

    module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(errMsg,400);
    }else{
        next();
    }
}

module.exports.isreviewAuther = async(req, res, next) => {
    const { id,reviewId } = req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You do not the auther !");
        return res.redirect(`/listings/${id}`);
    }
    next();
};