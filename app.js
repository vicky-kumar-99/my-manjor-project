if(process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

 

const express = require("express");   
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./model/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema} = require("./schema.js");
// const Review = require("./model/reviews.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js"); 
const {saveRedirectUrl,} = require("./middleware.js");
// const listingController = require("./controllers/listings.js");
// const reviewController = require("./controllers/reviews.js");
const userController = require("./controllers/users.js");

const listings = require("./routers/listing.js");
const reviews = require("./routers/review.js");

// const multer  = require('multer');
// const {storage} = require("../cloudConfig.js");
// // const upload = multer({ dest: 'uploads/' });
// const upload = multer({storage});

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOption = 
    {
       secret: "mysupersecretstring",
       resave: false,
       saveUninitialized: true,
       cookie: {
           expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
           maxAge: 7 * 24 * 60 * 60 * 1000,
           httpOnly: true,
       },
    };

main()
.then(() => {
    console.log("connection on db");
})
.catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("root is working");
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.use((req,res, next) => {
    res.locals.message = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


// app.get("/userdemo", async (req,res) => {
//     let fakeUser = new User({
//         email: "vicky@gmail.com",
//         username: "delta-student",
//     });
//     let newUser = await User.register(fakeUser, "vicky56");
//     res.send(newUser);
// })


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews );



// signUp page........

app.get("/signup", userController.renderSignUpFrom);

app.post("/signup", wrapAsync(userController.signUp)
);

//   login page ......

app.get("/login",userController.renderLoginForm);

app.post("/login",saveRedirectUrl,
     passport.authenticate('local', {
         failureRedirect: '/login' ,
         failureFlash: true,
        }), userController.login);

// logout .....

app.get("/logout",userController.logOut );

// app.get("/testListing", async (req, res) =>{
//      let simpleListing = new Listing({
//         title : "my new villa",
//         description : "by the beach",
//         prize : 1200,
//         location : "Calagunt, Goe",
//         country : "India",
//      });

//      await simpleListing.save();
//      console.log("simple was saved");
//      res.send("successfuly");
// })

app.all("*", (req,res,next) => {
     next(new ExpressError(404, "page not found"));
})


app.use((err,req,res,next) => {
    let {status = 500,message = "somethin went worng"} = err;
    res.status(status).render("error.ejs", {message});
    // res.status(status).send(message);

})

app.listen(8080, () => {
    console.log("listening on the port 8080");
});