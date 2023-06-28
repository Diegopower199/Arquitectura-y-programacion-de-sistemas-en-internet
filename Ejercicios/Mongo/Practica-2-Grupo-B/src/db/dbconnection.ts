import { MongoClient, Database, Collection } from "mongo";

import { config } from "std/dotenv/mod.ts";
import { User } from "../types.ts";
import { TransactionSchema, UserSchema } from "./schema.ts";


await config({ export: true, allowEmptyValues: true });

const connectMongoDB = async (): Promise<Database> => {
  const mongo_usr = Deno.env.get("MONGO_USR");
  const mongo_pwd = Deno.env.get("MONGO_PWD");
  const db_name = Deno.env.get("DB_NAME");
  const mongo_uri = Deno.env.get("MONGO_URI");

  if (!mongo_usr || !mongo_pwd || !db_name || !mongo_uri) {
    throw new Error(
      "Missing environment variables, check env.sample for creating .env file"
    );
  }

  const mongo_url = `mongodb+srv://${mongo_usr}:${mongo_pwd}@${mongo_uri}/${db_name}?authMechanism=SCRAM-SHA-1`;

  const client = new MongoClient();
  await client.connect(mongo_url);
  const db = client.database(db_name);
  return db;
};

const db = await connectMongoDB();
console.log(`MongoDB ${db.name} connected`);

export const UsersCollection: Collection<UserSchema> = db.collection<UserSchema>("Users");

export const TransactionsCollection: Collection<TransactionSchema> = db.collection<TransactionSchema>("Transactions")
