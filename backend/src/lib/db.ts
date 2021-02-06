import mongodb from 'mongodb';

import * as validator from './validator';

let db: mongodb.Db;

export async function init(uri: string): Promise<void> {
  const client: mongodb.MongoClient = await mongodb.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  db = client.db('database');

  db.collection('schemas').createIndex({ slug: 1 }, {unique: true});
}

export async function listenMongo(io: SocketIO.Server): Promise<void> {
  const changeStream = db.watch();
  changeStream.on('change', (next: any) => {
    if ('fullDocument' in next && next.operationType === 'insert') {
      const collection = next.ns.coll;
      if (collection !== "schemas" && next.fullDocument?.name !== undefined) {
        io.emit(collection, next.fullDocument.name);
      } else if (collection === "schemas" && next.fullDocument?.slug !== undefined && next.fullDocument.public) {
        io.emit(collection, next.fullDocument.slug);
      }
    }
  });
}

export async function getSchema(slug: string): Promise<validator.SchemaTemplate | null> {
  return db.collection('schemas').findOne({ slug: slug }, { projection: { _id: 0, apiKey: 0 } });
}

export async function getSchemaSlugs(): Promise<validator.SchemaTemplate[]> {
  return db.collection('schemas').find({}, { projection: { _id: 0, slug: 1, public: 1 } }).toArray();
}

export async function getSchemaApiKey(slug: string): Promise<validator.SchemaTemplate | null> {
  return db.collection('schemas').findOne({ slug: slug }, { projection: { _id: 0, apiKey: 1 } });
}

export async function deleteSchema(slug: string): Promise<number | undefined> {
  const result = await db.collection('schemas').deleteOne({ slug: slug });
  console.log(result.deletedCount);
  return result.deletedCount;
}

export async function insertSchema(value: validator.SchemaTemplate): Promise<validator.SchemaTemplate> {
  const response = await db.collection('schemas').insertOne(value);
  await db.collection(value.slug).createIndex({ email: 1 }, { unique: true });
  delete response.ops[0]._id;
  return response.ops[0];
}

export async function getRegs(collectionName: string): Promise<validator.RegTemplate[]> {
  return db.collection<validator.RegTemplate>(collectionName).find({}, { projection: { _id: 0 } }).toArray();
}

export async function getRegNames(collectionName: string): Promise<validator.RegTemplate[]> {
  return db.collection<validator.RegTemplate>(collectionName).find({}, { projection: { _id: 0, name: 1 } }).toArray();
}

export async function deleteRegs(collectionName: string): Promise<number | undefined> {
  const result = await db.collection(collectionName).deleteMany({});
  console.log(result.deletedCount);
  return result.deletedCount;
}

export async function insertReg(collectionName: string, value: validator.RegTemplate): Promise<validator.RegTemplate> {
  const response = await db.collection(collectionName).insertOne(value);
  delete response.ops[0]._id;
  return response.ops[0];
}

export async function count(collectionName: string): Promise<number> {
  return db.collection(collectionName).countDocuments();
}