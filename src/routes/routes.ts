import e from "express";
import { signin, signup } from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { createBlog, getAllBlogs, getAllPersonalBlogs, getSpecificBlog } from "../controllers/blog.controller";

export const router = e.Router()

// user routes

router.post('/auth/signup', signup)
router.post('/auth/signin', signin)

// blog routes

router.post('/create-blog', verifyToken, createBlog)
router.get('/get-all-blogs', verifyToken, getAllBlogs)
router.get('/get-all-personal-blogs', verifyToken, getAllPersonalBlogs)
router.get('/specific-blog/:id', verifyToken, getSpecificBlog)