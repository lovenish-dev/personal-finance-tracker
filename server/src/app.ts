import express from 'express';
import authRouter from './modules/auth/auth.routes.js'
import accountRouter from './modules/account/account.routes.js'
import categoryRouter from './modules/categories/category.routes.js'
import transactionRouter from './modules/transactions/transaction.routes.js';
import dashboardRouter from './modules/dashboard/dashboard.routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js';
import { AppError } from './utils/Apperror.js';
const app = express();

app.use(express.json())

app.get('/', (req, res)=> res.json({ message: "api running" }));

app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter)
app.use("/api/categories",categoryRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/dashboard", dashboardRouter)

app.use((req, res, next)=> next(new AppError("Route not Found", 404)));
app.use(errorMiddleware);
export default app;