import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, Request, Express } from 'express';
import expressSession from 'express-session';
import http from 'http';
import morgan from 'morgan';
import routes from './Controllers';
import { connectDatabase } from './db';
import log from './logger';
import { ServerSocket } from './socket';
import swaggerDocs from './swagger';

const MemoryStore = expressSession.MemoryStore;
const oneDay = 24 * 60 * 60 * 1000;

dotenv.config();
const port: number = Number(process.env.PORT) || 5000;
const dbUrl: string | undefined = process.env.MONGO_URL_ATLAS;
const app: Express = express();
const server = http.createServer(app);

app.use(cors());
new ServerSocket(server);

app.use(express.urlencoded({ extended: true }));

app.use(
    expressSession({
        store: new MemoryStore(),
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: oneDay,
        },
    }),
);
app.use(express.json());

// morgan.token('id', (req: Request) => req.params.id);
// morgan.token('body', (req: Request) => JSON.stringify(req.body));
// app.use(morgan(':id :body :method :url :response-time'));
// route(app);

server.listen(port, async () => {
    log.info(`Server is running at http://localhost:${port}`);
    await connectDatabase(dbUrl);
    routes(app);
    swaggerDocs(app, port);
});
