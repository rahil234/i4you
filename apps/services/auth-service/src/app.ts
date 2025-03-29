import express from 'express';
import authRoutes from '@/routes/auth.routes';
import {connectDB} from '@/config/db.config';
import {env} from '@/config';
import "@/config/grpc.server"
import httpLogger from "@repo/http-logger";
import * as path from "node:path";
import router from "@/routes/auth.routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(httpLogger());

app.use(httpLogger({logFilePath: path.join(__dirname, "logs/auth_service.log")}));

router.get('/health', (_req, res) => {
    res.send('Auth Service is up and running');
});

app.use('/', authRoutes);

const startServer = async () => {
    await connectDB();
    app.listen(env.PORT, () => {
        console.log('User Server running on port ', env.PORT);
    });
};

startServer();
