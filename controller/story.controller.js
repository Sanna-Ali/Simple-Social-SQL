const connection = require("../config/DB");
const jwt = require("jsonwebtoken");
const moment = require("moment");
/**-----------------------------------------------
 * @desc    get Stories
 * @route   /story/
 * @method  GET
 * @access  private
 * @details Fetches stories for the authenticated user, including stories from users they follow.
 *          Verifies the user's token, then retrieves stories from the database.
 ------------------------------------------------*/
module.exports.getStories = (req, res) => {
  // Extract the token from cookies
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  // Verify the token using JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Query to fetch stories from followed users
    const q = `SELECT s.*, u.name FROM story AS s JOIN user AS u ON (u.id=s.userId) LEFT JOIN  relation AS r
    ON (s.userId=r.followedUserId AND r.followerUserId= ?) LIMIT 4  `;

    // Execute the query
    connection.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
/**-----------------------------------------------
 * @desc    Add Story
 * @route   /story/add
 * @method  POST
 * @access  private
 * @details Allows an authenticated user to create a new story.
 *          Verifies the user's token, then inserts the story into the database.
 ------------------------------------------------*/
module.exports.addStory = (req, res) => {
  // Extract the token from cookies
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  // Verify the token using JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Query to insert a new story into the story table
    const q = `INSERT INTO story (img,createdAt,userId) VALUES (?)`;
    const values = [
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    // Execute the query
    connection.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Story has been created.");
    });
  });
};
/**-----------------------------------------------
 * @desc    delete Story
 * @route   /story/:id
 * @method  DELETE
 * @access  private
 * @details Allows an authenticated user to delete their own story.
 *          Verifies the user's token, then deletes the story from the database.
 ------------------------------------------------*/
module.exports.deleteStory = (req, res) => {
  // Extract the token from cookies
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  // Verify the token using JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Query to delete the story from the story table
    const q = `DELETE FROM story where id=? AND userId=?`;

    // Execute the query
    connection.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows === 0)
        return res.status(403).json("You can delete only your story!");
      return res.status(200).json("Story has been deleted.");
    });
  });
};
