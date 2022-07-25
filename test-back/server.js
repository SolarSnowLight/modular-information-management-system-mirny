import express, { Router } from "express";

import userRouter from './routes/user.routes';

const PORT = 5000;

const app = express()

app.use(express.json());

app.use('/api', userRouter); 


app.listen(PORT, () => console.log('SERVER STARTED ON PORT + ${PORT}'));