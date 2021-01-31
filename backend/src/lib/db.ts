import { noSniff } from 'helmet';
import mongodb from 'mongodb';

import * as validator from './validator';

let db: mongodb.Db;

export async function connect(uri: string): Promise<void> {
  const client: mongodb.MongoClient = await mongodb.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  db = client.db('database');
  db.collection('schemas').createIndex({ slug: 1 });
}

export async function listenMongo(io: SocketIO.Server): Promise<void> {
  const changeStream = db.watch();
  changeStream.on('change', (next) => {
    if ('fullDocument' in next && next.operationType === 'insert') {
      const collection = next.ns.coll;
      io.emit(collection, next.fullDocument);
    }
  });
}

export async function getAll(collectionName: string): Promise<unknown[]> {
    return db.collection(collectionName).find({}).toArray();
}

export async function getSchema(slug: string): Promise<validator.SchemaTemplate | null> {
    return db.collection('schemas').findOne({ slug: slug });
}

export async function get(collectionName: string, query: mongodb.FilterQuery<unknown>): Promise<validator.SchemaTemplate | null> {
    return db.collection(collectionName).findOne(query);
}

export async function count(collectionName: string): Promise<number> {
    return db.collection(collectionName).countDocuments();
}

export async function insert(collectionName: string, value: unknown): Promise<unknown> {
    const response = await db.collection(collectionName).insertOne(value);
    return response.ops[0]
}