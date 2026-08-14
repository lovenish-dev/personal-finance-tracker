import express from 'express';
import authRouter from './modules/auth/auth.routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js';
const app = express();

app.use(express.json())

app.get('/', (req, res)=>{
   return res.json({ message: "api running" })
})

app.use("/api/auth", authRouter);


app.use(errorMiddleware);
export default app;