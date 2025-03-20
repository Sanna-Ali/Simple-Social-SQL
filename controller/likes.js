const connection = require("../config/DB");
const jwt = require("jsonwebtoken");
const moment = require("moment");
/**-----------------------------------------------
 * @desc    Add like
 * @route   /like/add
 * @method  POST
 * @access  private
 * @details Allows an authenticated user to like a specific post.
 *          Verifies the user's token, then inserts a like into the database.
 ------------------------------------------------*/
module.exports.addLike = (req, res) => {
  // Extract the token from cookies
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  // Verify the token using JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("token is not valied ");
    // Query to insert a like into the likes table
    const q = "INSERT INTO likes (`userId`,`postId`) VALUES (?)";
    const values = [userInfo.id, req.body.postId];
    // Execute the query
    connection.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("post has been liked ");
    });
  });
};

/**-----------------------------------------------
 * @desc    Get likes
 * @route   /like/
 * @method  GET
 * @access  private
 * @details Fetches all user IDs who liked a specific post.
 *          Requires the postId as a query parameter.
 ------------------------------------------------*/
module.exports.getLike = (req, res) => {
  // Query to fetch user IDs who liked the post
  const q = `SELECT userId FROM  likes where postId=?`;
  // Execute the query
  connection.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.userId));
  });
};

/**-----------------------------------------------
 * @desc    dislike post 
 * @route   /like/
 * @method  PUT
 * @access  private
 * @details Allows an authenticated user to remove their like from a post.
 *          Verifies the user's token, then deletes the like from the database.
 ------------------------------------------------*/
module.exports.disLike = (req, res) => {
  // Extract the token from cookies
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");
  // Verify the token using JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const commentId = req.params.id;
    // Query to delete the like from the likes table
    const q = "DELETE FROM comment WHERE `id` = ? AND `userId` = ?";
    // Execute the query
    connection.query(q, [commentId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("Comment has been deleted!");
      return res.status(403).json("You can delete only your comment!");
    });
  });
};
