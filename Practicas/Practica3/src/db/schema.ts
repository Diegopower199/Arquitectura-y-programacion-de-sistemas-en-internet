import { User, Books, Author} from "../types.ts";
import { ObjectId } from "mongo";

export type UserSchema = User & {
  _id: ObjectId;
};

export type BooksSchema = Books & {
  _id: ObjectId;
};

export type AuthorSchema = Author & {
  _id: ObjectId;
};