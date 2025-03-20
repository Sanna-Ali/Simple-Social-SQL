const express = require("express");
const connection = require("../config/DB");
const { getUser, updateUser } = require("../controller/user");
const router = express.Router();
//localhost:8000/user/update
http: router.get("/:userId", getUser);
router.put("/update/:id", updateUser);
module.exports = router;
