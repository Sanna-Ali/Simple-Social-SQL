const router = require("express").Router();
const connection = require("../config/DB");
const { addPost, getPosts } = require("../controller/post");
router.get("/", getPosts);
router.post("/add", addPost);
module.exports = router;
