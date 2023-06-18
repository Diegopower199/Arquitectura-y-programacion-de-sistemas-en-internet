import { ObjectId } from "mongo";
import { PressHouse, Author, Book, User } from "../types.ts";


export type PressHouseSchema = Omit<PressHouse, "id" | "books"> & {
    _id: ObjectId,
    books: ObjectId[]
};

export type AuthorSchema = Omit<Author, "id" | "books"> & {
    _id: ObjectId,
    books: ObjectId[],
}

export type BookSchema = Omit<Book, "id" | "pressHouse" | "author"> & {
    _id: ObjectId,
    pressHouse: ObjectId,
    author: ObjectId,
}

export type UserSchema = Omit<User, "id" | "autoresQueSigue" | "librosQueTiene" | "librosQueLeGustariaTener"> & {
    _id: ObjectId,
    autoresQueSigue: ObjectId[],
    librosQueTiene: ObjectId[],
    librosQueLeGustariaTener: ObjectId[],
}