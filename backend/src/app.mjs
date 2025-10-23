import express from 'express';
import cors from 'cors';
import auth from './routes/auth.routes.mjs'
import threads from './routes/threads.routes.mjs'
import comments from './routes/comments.routes.mjs'
import votes from './routes/votes.routes.mjs'
import department from './routes/department.routes.mjs'
import avatar from "./routes/avatar.routes.mjs"

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(auth);
app.use("/threads",threads);
app.use("/comments",comments);
app.use("/votes",votes);
app.use("/department",department);
app.use("/avatar", avatar)


export default app;
