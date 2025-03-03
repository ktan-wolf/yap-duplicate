const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const {v2} = require("cloudinary");
const path = require('path');
const authRoutes = require('./route/auth');
const userRoutes = require('./route/user');
const cors = require("cors");
const connectMongoDB = require('./db/connectMongoDB');
const postRoutes = require('./route/post');
const notificationsRoutes = require('./route/notification');

dotenv.config();

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json({limit: "5mb"}));    
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:["http://localhost:5173", "yap-duplicate.vercel.app"],
    credentials: true // Allow cookies to be sent
}));


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationsRoutes);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}!`);
  connectMongoDB();
});