const router = require("express").Router();
const {
  getRelationships,
  addRelationship,
  deleteRelationship,
} = require("../controller/relation.controller.js");
router.get("/", getRelationships);
router.post("/add", addRelationship);
router.delete("/:id", deleteRelationship);
module.exports = router;
