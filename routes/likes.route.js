const router = require("express").Router();
const connection = require("../config/DB");
const { addLike, getLike, disLike } = require("../controller/likes.controller.js");
router.get("/", getLike);
router.post("/add", addLike);
router.put("/:id", disLike);
module.exports = router;
