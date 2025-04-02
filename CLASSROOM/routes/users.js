const express = require("express");
const router = express.Router();

router.get("/", (req,res) => {
    res.send("i am users");
});

router.get("/:id", (req,res) => {
    res.send("my id is show");
});

module.exports = router;