const router = require("express").Router();
const { getStories, addStory, deleteStory } = require("../controller/story.controller");
router.get("/", getStories);
router.post("/add", addStory);
router.delete("/:id", deleteStory);
module.exports = router;
