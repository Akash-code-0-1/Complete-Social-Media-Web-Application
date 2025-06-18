import { db } from "../connect.js";

export const getFriends = (req, res) => {
  const userId = req.params.userId;

  // Query for following with details
  const followingQuery = `
    SELECT u.id, u.name, u.profilePic 
    FROM relationships r
    JOIN users u ON u.id = r.followedUserId
    WHERE r.followerUserId = ?
  `;

  // Query for followers with details
  const followersQuery = `
    SELECT u.id, u.name, u.profilePic 
    FROM relationships r
    JOIN users u ON u.id = r.followerUserId
    WHERE r.followedUserId = ?
  `;

  db.query(followingQuery, [userId], (err, followingData) => {
    if (err) return res.status(500).json(err);

    db.query(followersQuery, [userId], (err, followersData) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json({ following: followingData, followers: followersData });
    });
  });
};





