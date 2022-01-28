import * as mongoDB from "mongodb"

export const collections: { names?: mongoDB.Collection, tokens?: mongoDB.Collection } = {}

export async function connectToDatabase() {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db: mongoDB.Db = client.db(process.env.MONGODB_DB);
    collections.names = db.collection(process.env.COLLECTION_N);
    collections.tokens = db.collection(process.env.COLLECTION_T);
}