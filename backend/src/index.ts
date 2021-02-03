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

app.get('/api/schemas', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const schemas = await db.getSchemas()
    const slugs = schemas.map(a => a.slug);
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
    const schema = await db.getSchema(slug)
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
    const schema = await db.getSchema(slug)
    if (schema !== null) {
      const registrations = await db.getRegs(slug)
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
    const schema = await db.getSchema(slug)
    if (schema !== null) {
      const value = await validator.validateReg(schema, req.body);
      const inserted = await db.insert(slug, value);
      res.json(inserted);
    } else {
      res.status(422).json({ error: 'registration does not exist'});
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422).json({ error: error.message });
    }
    next(error);
  }
});

async function main(): Promise<void> {
    const schema = {
      slug: 'prosevujut',
      capacity: 4,
      capacityMax: 20,
      startDate: new Date("Jan 23, 2021 12:37:10").getTime(),
      endDate: new Date("Jan 23, 2022 10:14:30").getTime(),

      form: {
        name: {
          type: 'Text',
          label: 'Etu- ja sukunimi',
          required: true,
        },
        notrequired: {
          type: 'Text',
          label: 'mp?',
        },
        group: {
          type: 'Select',
          label: 'Ryhmä',
          options: [
            'Opiskelija',
            'Alumnni',
            'Kutsuvieras',
          ],
          required: true,
        },
        email: {
          type: 'Email',
          label: 'Sähköposti',
          required: true,
        },
      }
    }
  await db.connect(uri);
  await db.listenMongo(io);
  try {
  await db.insert('schemas', schema);
  } catch {
    console.log("schema already at database");
  }

  http.listen(port, () => {
    console.log(`Socket.IO server  running at http://localhost:${port}/`);
  });
}

main();