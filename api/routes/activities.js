import express from "express";
import { getActivities } from "../controllers/activities.js";

const router = express.Router();

router.get("/", getActivities);

export default router;
