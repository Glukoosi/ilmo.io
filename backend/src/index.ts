import express from 'express';
import helmet from "helmet";
import cors from 'cors';
import crypto from 'crypto';

import * as db from './lib/db';
import * as validator from './lib/validator';

const app = express();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const http = require("http").Server(app);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const socketio = require('socket.io');

const port: number = Number(process.env.PORT) || 5000;
const mongoUri = 'mongodb://mongodb:27017/?replicaSet=rs0';
const corsUrl: string = process.env.CORS_URL || '';

const corsOptions = {
  origin: corsUrl,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
const io: SocketIO.Server = socketio(http, {
  cors: {
    origin: corsUrl,
    methods: ['GET', 'POST']
  }
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());

app.get('/', async (req: express.Request, res: express.Response) => {
  res.json({ msg: 'halojatahalloo' });
});

app.post('/api/schema', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const schema = await validator.validateSchema(req.body);
    const apiKey = crypto.randomBytes(200).toString('hex');
    schema.apiKey = apiKey;
    await db.insertSchema(schema);
    res.json({ msg: 'Success! You can access results with apiKey', apiKey: apiKey });

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
    const schemas = await db.getSchemaSlugs()
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

app.get('/api/registrations/names/:slug', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const slug: string = req.params.slug;
    const schema = await db.getSchema(slug);
    if (schema !== null) {
      const registrations = await db.getRegNames(slug);
      const names = registrations.map(a => a.name);
      res.json(names);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

app.get('/api/registration/:slug', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const slug: string = req.params.slug;
    const schema = await db.getSchemaApiKey(slug);
    if (schema !== null) {
      if (req.headers.authorization !== schema.apiKey) {
        res.sendStatus(401);
      } else {
        const registrations = await db.getRegs(slug);
        res.json(registrations);
      }
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

app.delete('/api/registration/:slug', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const slug: string = req.params.slug;
    const schema = await db.getSchemaApiKey(slug);
    if (schema !== null) {
      if (req.headers.authorization !== schema.apiKey) {
        res.sendStatus(401);
      } else {
        await db.deleteRegs(slug);
        await db.deleteSchema(slug);
        res.sendStatus(200);
      }
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
  await db.init(mongoUri);
  await db.listenMongo(io);

  http.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}

main();