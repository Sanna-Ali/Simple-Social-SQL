const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const auth = require("./routes/auth.route.js");
const post = require("./routes/post.route.js");
const comment = require("./routes/comment.route.js");
const like = require("./routes/likes.route.js");
const user = require("./routes/user.route.js");
const relation = require("./routes/relation.route.js");

// Init App
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
// app.use(cors({ origin: "http://localhost:8000", credentials: true }));
app.use(cookieParser());

app.use("/auth", auth);
app.use("/post", post);
app.use("/like", like);
app.use("/user", user);
app.use("/comment", comment);
app.use("/relation", relation);
module.exports = app;
