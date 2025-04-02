const express = require("express");   
const app = express();
const users = require("./routes/users.js");
const posts = require("./routes/posts.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path"); 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// const cookieparser = require("cookie-parser");

// app.use(cookieparser("secretcode"));

// app.get("/getcookieparser", (req,res) => {
//      res.cookie("color", "red", {signed : true})
//      res.send("done");
// });

// app.get("/verfy", (req,res) => {
//     console.log(req.signedCookies);
// })

// app.get("/getcookie", (req,res) => {
//     console.dir(req.cookies);
//     res.cookie("india", "namste");
//     res.send("we sent you a cookie");
// })

// app.get("/", (req,res) => {
//     res.send("home page");
//     console.dir(req.cookies);
// });

// app.use("/users", users);
// app.use("/posts", posts);


app.use(session(
    {
        secret :"mysupersecretstring",
        resave: false,
        saveUninitialized: true,
    }));
app.use(flash());

app.use((req,res,next) => {
    res.locals.message = req.flash("success");
    next();
})

app.get("/register", (req,res) => {
    let {name = "puspa"} = req.query;
    req.session.name = name;
    req.flash("success", "your register is successfully");
    res.redirect("/user");
});

app.get("/user", (req,res) => {
    
    res.render("page.ejs", {name: req.session.name});
});

// app.get("/reqcount", (req,res) => {
//     if(req.session.count) {
//         req.session.count++;
//     }
//     else {
//         req.session.count = 1;
//     }
    
//     res.send(`you send a req ${ req.session.count} time`);
// })


app.listen(3000, () => {
    console.log("server is listing on the port");
})