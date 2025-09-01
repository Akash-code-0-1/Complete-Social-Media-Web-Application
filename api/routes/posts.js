import express from "express";
import { getPosts, addPost } from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);   // feed or profile posts
router.post("/", addPost);   // add new post

export default router;
