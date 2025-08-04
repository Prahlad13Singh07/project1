const Listing = require('../Models/listing');
const { listingSchema } = require("../Schema");


// index route
// This route will display all listings
module.exports.index=async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

// renderNewForm route
// This route will render the form to create a new listing
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

// show route
// This route will display a specific listing by its ID
module.exports.showListing=async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",
        populate:{
            path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Cannot find that listing!");
        return res.redirect("/listings");
    }console.log(listing);
    res.render("listings/show",{listing});

};

// createListing route
// This route will create a new listing
module.exports.createListing=async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let result=listingSchema.validate(req.body);
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
        await newListing.save();
        req.flash("success","Successfully created a new listing!");
        res.redirect("/listings");
}

// edit route
// This route will render the edit form for a specific listing
module.exports.renderEditForm=async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Cannot find that listing!");
        return res.redirect("/listings");
    }
    let originalimageUrl=listing.image.url;
    originalimageUrl=originalimageUrl.replace("/upload","/upload/w_200,h_200,c_fill");
    res.render("listings/edit",{listing,originalimageUrl});
};

// update route
// This route will update a specific listing by its ID
module.exports.updateListing=async(req,res)=>{
    const {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    
    req.flash("success","Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
};

// delete route
// This route will delete a specific listing by its ID
module.exports.destroyListing=async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Successfully deleted the listing!");
    res.redirect("/listings");
};