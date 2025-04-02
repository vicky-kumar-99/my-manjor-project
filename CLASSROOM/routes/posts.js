const express = require("express");
const router = express.Router();

router.get("/", (req,res) => {
    res.send("i am  post");
});

router.get("/:id", (req,res) => {
    res.send("my id is show post");
});

module.exports = router;