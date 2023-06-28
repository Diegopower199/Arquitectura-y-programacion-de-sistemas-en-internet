import { ObjectId } from "mongo";
import { Book, User, Author } from "../types.ts";


/*export type schema1 = Omit<tipo1, "id"> & {
    _id: ObjectId;
};*/

export type UserSchema = Omit<User, "id" | "cart"> & {
    _id: ObjectId,
    cart: ObjectId[],
}

export type BookSchema = Omit<Book, "id"> & {
    _id: ObjectId,
}

export type AuthorSchema = Omit<Author, "id" | "books"> & {
    _id: ObjectId,
    books: ObjectId[]
}