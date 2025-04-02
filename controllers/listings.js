const Listing = require("../model/listing.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");


module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing});
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res, next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path : "reviews" , populate : {path: "author"},})
    .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested does not exist ");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async (req, res, next) => {
    try {
        const { error } = listingSchema.validate(req.body);
        if (error) {
            throw new ExpressError(400, error.details.map(el => el.message).join(', '));
        }

        if (!req.file) {
            throw new ExpressError(400, "Image file is required");
        }
         
        const { path: url, filename } = req.file;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };

        if (!newListing.title || !newListing.description || !newListing.location) {
            throw new ExpressError(400, "Title, description, and location are required");
        }

        

        await newListing.save();
        req.flash("success", "New Listing Added");
        res.redirect(`/listings/${newListing._id}`);
    } catch (err) {
        next(err);
    }
};

   module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "Edit Listing");
    if(!listing) {
        req.flash("error", "Listing you requested does not exist ");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}

module.exports.updateListing = async (req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Update Listing");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}



