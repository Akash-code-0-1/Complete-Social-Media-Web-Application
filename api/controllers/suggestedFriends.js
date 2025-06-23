import { db } from "../connect.js";

export const getSuggestedUsers = (req, res) => {
  const currentUserId = req.params.userId;

  const q = `
    SELECT DISTINCT u.id, u.name, u.profilePic
    FROM relationships r1
    JOIN relationships r2 ON r1.followerUserId = r2.followerUserId
    JOIN users u ON u.id = r2.followedUserId
    WHERE r1.followedUserId = ?
      AND r2.followedUserId != ?
      AND r2.followedUserId NOT IN (
        SELECT followedUserId FROM relationships WHERE followerUserId = ?
      )
    LIMIT 10
  `;

  db.query(q, [currentUserId, currentUserId, currentUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};
