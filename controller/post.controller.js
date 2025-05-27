const connection = require("../config/DB");
const jwt = require("jsonwebtoken");
const moment = require("moment");
/**-----------------------------------------------
 * @desc    Get posts
 * @route   /post
 * @method  POST
 * @access  private
 * @details Fetches posts for the authenticated user, including posts from users they follow.
 *          Verifies the user's token, then retrieves posts from the database.
 ------------------------------------------------*/
module.exports.getPosts = (req, res) => {
  // Extract the token from cookies
  const token = req.cookies.accessToken;
  console.log(req.cookies.accessToken);
  // Check if token exists
  if (!token) {
    return res.status(401).json("Not logged in");
  }

  // Verify the token using JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid");
    }

    // SQL query to fetch posts created by followed users
    const q = `
    SELECT p.*, u.id AS userId, name, profilePic
    FROM post AS p
    JOIN user AS u ON (u.id = p.userId)
    left JOIN relationship AS r ON (p.userId = r.followedUserId) Where r.followerUserId = ? OR p.userId=?
    ORDER By p.createdAt DESC
`;

    // Execute the SQL query
    connection.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) {
        return res.status(500).json(err); // Return server error if query fails
      }

      // Send the retrieved data as a response
      return res.status(200).json(data);
    });
  });
};
/**-----------------------------------------------
 * @desc    Add A New  Post
 * @route   /post/add
 * @method  POST
 * @access  private
 * @details Allows an authenticated user to create a new post.
 *          Verifies the user's token, then inserts the post into the database.
 ------------------------------------------------*/
module.exports.addPost = (req, res) => {
  // Extract the token from cookies
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  // Verify the token using JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("token is not valied ");
    // Query to insert a new post into the post table
    const q =
      "INSERT INTO post( `description`, `img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.description,
      req.body.img, //.format("YY-MM-DD HH:mm:ss"),
      moment(Date.now()).format("YY-MM-DD  HH:MM:SS"),
      userInfo.id,
    ]; //moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    // Execute the query
    connection.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("post has been created");
    });
  });
};

// const q =
// "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
// const values = [
// req.body.desc,
// req.body.img,
// moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
// userInfo.id,
// ];

// get post
// module.exports.getPosts = (req, res) => {
//   const token = req.cookies.accessToken;
//   if (!token) return res.status(401).json("not logged in");
//   jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
//     if (err) return res.status(403).json("Token  is not valid");
//     const q = `SELECT p.*,u.id AS userId,name,profilePic
//     FROM posts AS p
//     JOIN users AS u
//     ON (u.id=p.userId)
//     JOIN relationship AS r on (p.userId=r.followedUserId AND r.followerUserId=? )
//     `;
//     connection.query(q, [userInfo.id], (err, data) => {
//       if (err) return res.status(500).json(err);
//       return res.status(200).json(data);
//     });
//   });
// };
////
// const q = `
// SELECT p.*, u.id AS userId, name, profilePic
// FROM posts AS p
// JOIN users AS u ON (u.id = p.userId)
//  left JOIN relationship AS r ON (p.userId = r.followedUserId) Where r.followerUserId = ? OR p.userId=?)
// `;
// q = `SELECT p.*, u.id AS userId, name, profilePic
// FROM posts AS p
// JOIN users AS u ON (u.id = p.userId)
// JOIN relationship AS r ON (p.userId = r.followedUserId AND r.followerUserId = ?)`;
