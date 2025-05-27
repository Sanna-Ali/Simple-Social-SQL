const router = require("express").Router();
const connection = require("../config/DB");
const { addPost, getPosts } = require("../controller/post.controller.js
");
router.get("/", getPosts);
router.post("/add", addPost);
module.exports = router;
