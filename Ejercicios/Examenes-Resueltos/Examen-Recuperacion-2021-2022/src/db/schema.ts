import { ObjectId } from "mongo";
import { PressHouse, Author, Book } from "../types.ts";


/*export type algoSchema = Omit<algo, "id"> & {
    _id: ObjectId,
}*/

export type PressHouseSchema = Omit<PressHouse, "id" | "books"> & {
    _id: ObjectId,
    books: ObjectId[],
}

export type AuthorSchema = Omit<Author, "id" | "books"> & {
    _id: ObjectId,
    books: ObjectId[],
}

export type BookSchema = Omit<Book, "id" | "author" | "pressHouse"> & {
    _id: ObjectId,
    author: ObjectId,
    pressHouse: ObjectId
}
