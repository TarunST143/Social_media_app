import express from 'express';
import { login, register } from '../controllers/Auth.js';
import { createPost } from '../controllers/createPost.js';
import { fetchAllPosts, fetchAllStories, fetchUserImg, fetchUserName } from '../controllers/Posts.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/createPost', createPost);
router.get('/fetchAllPosts', fetchAllPosts);
router.get('/fetchUserName', fetchUserName);
router.get('/fetchUserImg', fetchUserImg);
router.get('/fetchAllStories', fetchAllStories);

export default router;