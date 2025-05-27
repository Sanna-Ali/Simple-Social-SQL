const router = require("express").Router();
const connection = require("../config/DB");
const {
  getComment,
  addcomment,
  deleteComment,
} = require("../controller/comment.controller.js");
router.get("/", getComment);
router.post("/add", addcomment);
router.delete("/:id", deleteComment);
module.exports = router;
