import express from 'express';
import authRouter from './modules/auth/auth.routes.js'
import accountRouter from './modules/account/account.routes.js'
import categoryRouter from './modules/categories/category.routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js';
const app = express();

app.use(express.json())

app.get('/', (req, res)=> res.json({ message: "api running" }));

app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter)
app.use("/api/categories",categoryRouter);

app.use(errorMiddleware);
export default app;