import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getOnlineFriends = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token");

    const q = `
      SELECT u.id, u.name, u.profilePic, u.isOnline, u.lastSeen
      FROM users u
      JOIN relationships r ON u.id = r.followedUserId
      WHERE r.followerUserId = ?
      ORDER BY u.isOnline DESC, u.lastSeen DESC
    `;

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
