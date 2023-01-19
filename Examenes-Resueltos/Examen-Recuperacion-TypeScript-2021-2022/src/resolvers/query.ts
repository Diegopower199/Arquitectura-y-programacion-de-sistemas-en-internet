import { ObjectId } from "mongo";
import {
  AuthorsCollection,
  BooksCollection,
  PressHouseCollection,
} from "../db/dbconnection.ts";
import { AuthorSchema, BookSchema, PressHouseSchema } from "../db/schema.ts";
import { Book } from "./Book.ts";

export const Query = {
  books: async (parent: unknown, args: {}): Promise<BookSchema[]> => {
    try {
      const books: BookSchema[] = await BooksCollection.find({}).toArray();

      return books.map((libro: BookSchema) => ({
        _id: libro._id,
        title: libro.title,
        author: libro.author,
        pressHouse: libro.pressHouse,
        year: libro.year,
      }));
    } catch (e) {
      throw new Error(e);
    }
  },
  authors: async (parent: unknown, args: {}): Promise<AuthorSchema[]> => {
    try {
      const authors: AuthorSchema[] = await AuthorsCollection.find({})
        .toArray();

      return authors.map((author: AuthorSchema) => ({
        _id: author._id,
        name: author.name,
        lang: author.lang,
        books: author.books,
      }));
    } catch (e) {
      throw new Error(e);
    }
  },
  presshouses: async (
    parent: unknown,
    args: {},
  ): Promise<PressHouseSchema[]> => {
    try {
      const pressHouses: PressHouseSchema[] = await PressHouseCollection.find(
        {},
      )
        .toArray();

      return pressHouses.map((pressHouse: PressHouseSchema) => ({
        _id: pressHouse._id,
        name: pressHouse.name,
        web: pressHouse.web,
        country: pressHouse.country,
        books: pressHouse.books,
      }));
    } catch (e) {
      throw new Error(e);
    }
  },
  book: async (parent: unknown, args: { id: string }): Promise<BookSchema> => {
    try {
      const book: BookSchema | undefined = await BooksCollection.findOne({
        _id: new ObjectId(args.id),
      });

      if (!book) {
        throw new Error("Error, ese libro no existe");
      }

      return {
        _id: book._id,
        title: book.title,
        author: book.author,
        pressHouse: book.pressHouse,
        year: book.year,
      };
    } catch (e) {
      throw new Error(e);
    }
  },

  author: async (
    parent: unknown,
    args: { id: string },
  ): Promise<AuthorSchema> => {
    try {
      const author: AuthorSchema | undefined = await AuthorsCollection.findOne({
        _id: new ObjectId(args.id),
      });

      if (!author) {
        throw new Error("Error, ese author no existe");
      }

      return {
        _id: author._id,
        name: author.name,
        lang: author.lang,
        books: author.books,
      };
    } catch (e) {
      throw new Error(e);
    }
  },

  presshouse: async (
    parent: unknown,
    args: { id: string },
  ): Promise<PressHouseSchema> => {
    try {
      const pressHouse: PressHouseSchema | undefined =
        await PressHouseCollection
          .findOne({
            _id: new ObjectId(args.id),
          });

      if (!pressHouse) {
        throw new Error("Error, ese press house no existe");
      }

      return {
        _id: pressHouse._id,
        name: pressHouse.name,
        web: pressHouse.web,
        country: pressHouse.country,
        books: pressHouse.books,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
};
