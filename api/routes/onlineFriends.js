import express from "express";
import { getOnlineFriends } from "../controllers/onlineFriends.js";

const router = express.Router();
router.get("/", getOnlineFriends);

export default router;
