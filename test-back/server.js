
import express from "express";

import userRouter from './routes/user.routes';

const PORT = 5000;

const app = express()

app.use(express.json()) // чтобы можно было отправлять с клиента POST запросы в json формате

app.get('/', (req, res) => {
    console.log(req.body);
    res.status(200).json('Сервер запущен');
})

app.listen(PORT, () => console.log('SERVER STARTED ON PORT ' + PORT));