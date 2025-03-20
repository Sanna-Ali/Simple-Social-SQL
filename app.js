const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const auth = require("./routes/auth");
const post = require("./routes/post");
const comment = require("./routes/comment");
const like = require("./routes/likes");
const user = require("./routes/user");
const relation = require("./routes/relation");

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
