import express from 'express';
import helmet from "helmet";
import cors from 'cors';

import * as db from './lib/db';
import * as validator from './lib/validator';

const app = express();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const http = require("http").Server(app);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const socketio = require('socket.io');

const io: SocketIO.Server = socketio(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use(helmet());

const port: number = Number(process.env.PORT) || 5000;
const uri: string = process.env.MONGO_URL || 'mongodb://mongodb:27017/?replicaSet=rs0';

app.get('/', async (req: express.Request, res: express.Response) => {
  res.json({ msg: 'halojatahalloo' });
});

app.post('/api/schema', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const schema = await validator.validateSchema(req.body);
    const inserted = await db.insertSchema(schema);
    res.json(inserted);

  } catch (error) {
    if (error.message.startsWith('E11000 duplicate key error collection: database.schemas index:')){
      res.status(422).json({ error: 'slug is taken :thinking:' });
    } else if (error.name === 'ValidationError') {
      res.status(422).json({ error: error.message });
    }
    next(error);
  }
});

app.get('/api/schemas', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const schemas = await db.getSchemas()
    const slugs = schemas.filter(a => a.public === true).map(a => a.slug);
    if (schemas !== null) {
      res.json(slugs);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

app.get('/api/schema/:slug', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const slug: string = req.params.slug;
    const schema = await db.getSchema(slug);
    if (schema !== null) {
      res.json(schema);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

app.get('/api/registrations/:slug', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const slug: string = req.params.slug;
    const schema = await db.getSchema(slug);
    if (schema !== null) {
      const registrations = await db.getRegs(slug);
      const names = registrations.map(a => a.name);
      res.json(names);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

app.post('/api/registration/:slug', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const slug: string = req.params.slug;
    const schema = await db.getSchema(slug);
    if (schema !== null) {
      const value = await validator.validateReg(schema, req.body);
      const inserted = await db.insertReg(slug, value);
      res.json(inserted);
    } else {
      res.status(422).json({ error: 'registration does not exist'});
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422).json({ error: error.message });
    } else if (error.message.startsWith('E11000 duplicate key error collection: database')){
      res.status(422).json({ error: 'you have already registered' });
    }
    next(error);
  }
});

async function main(): Promise<void> {
  await db.init(uri);
  await db.listenMongo(io);

  http.listen(port, () => {
    console.log(`Socket.IO server  running at http://localhost:${port}/`);
  });
}

main();