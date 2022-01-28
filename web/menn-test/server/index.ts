import express, {Request, Response} from "express";
import next from "next";
import {LinksRouter} from './routes/links.router';
import {namesRouter} from './routes/names.router';
import { tokenRouter } from "./routes/tokens.router";
import { notificationRouter } from "./routes/notifications.router";
import {connectToDatabase} from "./services/database.service";
import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "./menn-app-firebase-adminsdk-hhiyx-c2b5ec8b07.json";

const dev = process.env.NODE_ENV !== "production";
const app = next({dev});
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

(async () => {
    try {
        await app.prepare();
        await connectToDatabase();
        admin.initializeApp({credential: admin.credential.cert(serviceAccount as ServiceAccount)});
        const server = express();
        server.use(express.json());

        server.use('/api/links', LinksRouter);
        server.use('/api/names', namesRouter);
        server.use('/api/tokens', tokenRouter);
        server.use('/api/notifications', notificationRouter);

        server.get('*', (req: Request, res: Response) => {
            return handle(req, res);
        });

        server.listen(port, (err?: any) => {
            if (err) throw err;
            console.log(`Server running on port ${port}`);
        });
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
})();
