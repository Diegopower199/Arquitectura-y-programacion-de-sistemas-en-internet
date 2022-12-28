import { ObjectId } from "mongo";
import { Books } from "../types.ts";
import { User } from "../types.ts";
import { Author } from "../types.ts";

export type BooksSchema = Books & {
  _id: ObjectId;
};

export type UserSchema = User & {
  _id: ObjectId;
};

export type AuthorSchema = Author & {
  _id: ObjectId;
};
