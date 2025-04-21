import express from 'express';
import dotenv from 'dotenv';
import connectdb from './DB/connectdb.js';
import userRoute from './routes/userRoute.js';
import messageRoute from './routes/messageRoute.js';
import cookieParser from 'cookie-parser';
import UserSearchRoute from './routes/userSearchRoute.js';
import {server, app} from './Socket/socket.js';
import path from 'path';

const __dirname = path.resolve();

dotenv.config();

app.use(express.json());
app.use(cookieParser());



app.use("/api/auth", userRoute);
app.use("/api/message", messageRoute);
app.use("/api/user", UserSearchRoute);

app.use(express.static(path.join(__dirname, 'Frontend/dist')));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "Frontend", "dist", "index.html"))
});

const port = process.env.PORT || 4004;



server.listen(port, () => {
    connectdb();
    console.log(`Server is running on port ${port}`);
});