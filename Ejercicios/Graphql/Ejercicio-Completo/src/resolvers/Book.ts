import { BookSchema } from "../db/schema.ts";


export const Book = {
    _id: (parent: BookSchema): string => parent._id.toString(),
}