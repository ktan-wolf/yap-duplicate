const express = require('express');
const { signup, login, logout, getMe } = require('../controller/auth');
const protectRoute = require('../middleware/protectRoute');

const authRouter = express.Router();

authRouter.get('/me', protectRoute, getMe);
authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);


module.exports=authRouter;
