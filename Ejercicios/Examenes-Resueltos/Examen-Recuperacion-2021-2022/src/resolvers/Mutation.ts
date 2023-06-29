import { ObjectId } from "mongo";
import { PressHouseSchema } from "../db/schema.ts";
import { AuthorSchema } from "../db/schema.ts";
import { BookSchema } from "../db/schema.ts";
import {
  AuthorsCollection,
  BooksCollection,
  PressHousesCollection,
} from "../db/dbconnection.ts";

export const Mutation = {
  addPressHouse: async (
    _: unknown,
    args: { name: string; web: string; country: string; books: string[] }
  ): Promise<PressHouseSchema> => {
    try {
      const { name, web, country, books } = args;

      const pressHouseEncontrado = await PressHousesCollection.findOne({
        name: name,
      });

      if (pressHouseEncontrado) {
        throw new Error("Press house ya existe con ese nombre");
      }

      const addPressHouse = await PressHousesCollection.insertOne({
        name: name,
        web: web,
        country: country,
        books: books.map((book) => new ObjectId(book)),
      });

      return {
        _id: addPressHouse,
        name: name,
        web: web,
        country: country,
        books: books.map((book) => new ObjectId(book)),
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  addAuthor: async (
    _: unknown,
    args: { name: string; lang: string; books: string[] }
  ): Promise<AuthorSchema> => {
    try {
      const { name, lang, books } = args;

      const authorEncontrado = await AuthorsCollection.findOne({
        name: name,
      });

      if (authorEncontrado) {
        throw new Error("Author ya existe");
      }

      const addAuthor = await AuthorsCollection.insertOne({
        name: name,
        lang: lang,
        books: books.map((book) => new ObjectId(book)),
      });

      return {
        _id: addAuthor,
        name: name,
        lang: lang,
        books: books.map((book) => new ObjectId(book)),
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  addBook: async (
    _: unknown,
    args: { title: string; author: string; pressHouse: string; year: number }
  ): Promise<BookSchema> => {
    try {
      const { title, author, pressHouse, year } = args;

      const pressHouseExiste = await PressHousesCollection.findOne({
        _id: new ObjectId(pressHouse),
      });

      if (!pressHouseExiste) {
        throw new Error("Press House no existe");
      }

      const authorExiste = await AuthorsCollection.findOne({
        _id: new ObjectId(author),
      });

      if (!authorExiste) {
        throw new Error("Author no existe");
      }

      const addBook = await BooksCollection.insertOne({
        title: title,
        author: new ObjectId(author),
        pressHouse: new ObjectId(pressHouse),
        year: year,
      });

      await PressHousesCollection.updateOne(
        { _id: new ObjectId(pressHouse) },
        {
          $push: {
            books: {
              $each: [addBook],
            },
          },
        }
      );

      await AuthorsCollection.updateOne(
        { _id: new ObjectId(author) },
        {
          $push: {
            books: {
              $each: [addBook],
            },
          },
        }
      );

      return {
        _id: addBook,
        title: title,
        author: new ObjectId(author),
        pressHouse: new ObjectId(pressHouse),
        year: year,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  deletePressHouse: async (
    _: unknown,
    args: { id: string }
  ): Promise<PressHouseSchema> => {
    try {
      const { id } = args;

      const pressHouseExiste = await PressHousesCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!pressHouseExiste) {
        throw new Error("Press house no existe");
      }

      await PressHousesCollection.deleteOne({
        _id: new ObjectId(id),
      });

      const libros = await BooksCollection.find({
        pressHouse: new ObjectId(id),
      }).toArray();
      await BooksCollection.deleteMany({ pressHouse: new ObjectId(id) });
      await AuthorsCollection.updateMany(
        {},
        {
          $pull: {
            books: {
              $in: libros.map((libro) => libro._id),
            },
          },
        }
      );

      return {
        _id: pressHouseExiste._id,
        name: pressHouseExiste.name,
        web: pressHouseExiste.web,
        country: pressHouseExiste.country,
        books: pressHouseExiste.books,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  deleteAuthor: async (
    _: unknown,
    args: { id: string }
  ): Promise<AuthorSchema> => {
    try {
      const { id } = args;

      const authorExiste = await AuthorsCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!authorExiste) {
        throw new Error("Author no existe");
      }

      await AuthorsCollection.deleteOne({
        _id: new ObjectId(id),
      });

      const libros = await BooksCollection.find({
        author: new ObjectId(id),
      }).toArray();

      await BooksCollection.deleteMany({ author: new ObjectId(id) });
      await PressHousesCollection.updateMany(
        {},
        {
          $pull: {
            books: {
              $in: libros.map((libro) => libro._id),
            },
          },
        }
      );

      return {
        _id: authorExiste._id,
        name: authorExiste.name,
        lang: authorExiste.lang,
        books: authorExiste.books,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  deleteBook: async (_: unknown, args: { id: string }): Promise<BookSchema> => {
    try {
      const { id } = args;

      const bookExiste = await BooksCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!bookExiste) {
        throw new Error("Book no existe");
      }

      await BooksCollection.deleteOne({
        _id: new ObjectId(id),
      });

      await PressHousesCollection.updateMany(
        { _id: bookExiste.pressHouse },
        {
          $pull: {
            books: bookExiste._id,
          },
        }
      );

      await AuthorsCollection.updateMany(
        { _id: bookExiste.author },
        {
          $pull: {
            books: bookExiste._id,
          },
        }
      );

      return {
        _id: bookExiste._id,
        title: bookExiste.title,
        author: bookExiste.author,
        pressHouse: bookExiste.pressHouse,
        year: bookExiste.year,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};

/*
deleteBook: async (_: unknown, args: { id: string }): Promise<BookSchema> => {
},

updateBooksMore2000: async (_: unknown, args: {}): Promise<number> => {
},
*/
