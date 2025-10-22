import express from 'express';
import cors from 'cors';
import auth from './routes/auth.routes.mjs'


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(auth);


export default app;
