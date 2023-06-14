import { ObjectId } from "mongo";
import { PressHouse, Author, Book } from "../types.ts";


export type PressHouseSchema = Omit<PressHouse, "id" | "books"> & {
    _id: ObjectId,
    books: ObjectId[]
};

export type AuthorSchema = Omit<Author, "id" | "books"> & {
    _id: ObjectId,
    books: ObjectId[]
}

export type BookSchema = Omit<Book, "id" | "pressHouse" | "author"> & {
    _id: ObjectId,
    pressHouse: ObjectId,
    author: ObjectId,
}