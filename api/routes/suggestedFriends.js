import express from "express";
import { getSuggestedUsers } from "../controllers/suggestedFriends.js";

const router = express.Router();

router.get("/:userId", getSuggestedUsers);

export default router;
