import express, {NextFunction, Request, Response} from "express";
import next from "next";
import {LinksRouter} from './routes/links.router';
import {namesRouter} from './routes/names.router';
import { tokenRouter } from "./routes/tokens.router";
import { notificationRouter } from "./routes/notifications.router";
import {connectToDatabase, collections} from "./services/database.service";
import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "./menn-app-firebase-adminsdk-4k7sp-72bf6dce27.json";
import cors from "cors";
import helmet from "helmet";

const dev = process.env.NODE_ENV !== "production";
const app = next({dev: false});
const port = process.env.PORT || 3000;

(async () => {
    try {
        await app.prepare();
        await connectToDatabase();
        const handle = app.getRequestHandler();
        admin.initializeApp({credential: admin.credential.cert(serviceAccount as ServiceAccount)});
        const server = express();
        //server.use(helmet());
        //server.use(cors());
        server.use(express.json());

        server.use('/api/links', LinksRouter);
        server.use('/api/names', namesRouter);
        server.use('/api/tokens', tokenRouter);
        server.use('/api/notifications', notificationRouter);

        server.get('/names/:id', async (req: Request, res: Response, nextFun: NextFunction) => {
            const { id } = req.params;
            const result = await collections.names.findOne({name: id});

            if (!result) {
                return app.render404(req, res);
            }

            app.render(req, res, `/names/${id}`, {userName: id});
        });

        server.get('*', async (req: Request, res: Response) => {
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
