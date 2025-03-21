import express from 'express';
import userRoutes from '@/routes/user.routes';
import {connectDB} from '@/config/db.config';
import {env} from '@/config';
import "@/config/grpc.server"
import httpLogger from "@repo/http-logger";
import * as path from "node:path";

const app = express();

app.use(express.json());

app.use(httpLogger());

app.use(httpLogger({ logFilePath: path.join(__dirname, "logs/user_service.log") }));

app.use('/api/users', userRoutes);

const startServer = async () => {
    await connectDB();
    app.listen(env.PORT, () => {
        console.log('User Server running on port ', env.PORT);
    });
};

startServer();
