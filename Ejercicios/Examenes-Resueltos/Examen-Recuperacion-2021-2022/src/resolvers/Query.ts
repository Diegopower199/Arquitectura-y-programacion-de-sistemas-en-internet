import { ObjectId } from "mongo";
import { BookSchema } from "../db/schema.ts";
import { BooksCollection } from "../db/dbconnection.ts";
import { AuthorSchema } from "../db/schema.ts";
import { AuthorsCollection } from "../db/dbconnection.ts";
import { PressHouseSchema } from "../db/schema.ts";
import { PressHousesCollection } from "../db/dbconnection.ts";


export const Query = {
  books: async (_: unknown, _args: {}): Promise<BookSchema[]> => {
    try {
      const allBooks = await BooksCollection.find({}).toArray();

      return allBooks.map( (book: BookSchema) => ({
        _id: book._id,
        author: book.author,
        pressHouse: book.pressHouse,
        title: book.title,
        year: book.year,
      }))

    }
    catch(error) {
        throw new Error(error);
    }
  },
  authors: async (_: unknown, _args: {}): Promise<AuthorSchema[]> => {
    try {
      const allAuthors = await AuthorsCollection.find({}).toArray();

      return allAuthors.map( (author: AuthorSchema) => ({
        _id: author._id,
        name: author.name,
        lang: author.lang,
        books: author.books.map( (book) => new ObjectId(book))
      }))
      
    }
    catch(error) {
        throw new Error(error);
    }
  },
  presshouses: async (_: unknown, _args: {}): Promise<PressHouseSchema[]> => {
    try {
      const allPresshouses = await PressHousesCollection.find({}).toArray();
      
      return allPresshouses.map( (pressHouse: PressHouseSchema) => ({
        _id: pressHouse._id,
        books: pressHouse.books.map( (book) => new ObjectId(book)),
        country: pressHouse.country,
        name: pressHouse.name,
        web: pressHouse.web
      }))
    }
    catch(error) {
        throw new Error(error);
    }
  },
  book: async (_: unknown, args: { id: string }): Promise<BookSchema> => {
    try {
      const { id } = args;

      const bookEncontrado = await BooksCollection.findOne({
        _id: new ObjectId(id),
      })

      if (!bookEncontrado) {
        throw new Error("Book no existe")
      }

      return {
        _id: bookEncontrado._id,
        author: bookEncontrado.author,
        pressHouse: bookEncontrado.pressHouse,
        title: bookEncontrado.title,
        year: bookEncontrado.year
      }
    }
    catch(error) {
        throw new Error(error);
    }
  },
  author: async (_: unknown, args: { id: string }): Promise<AuthorSchema> => {
    try {
      const { id } = args;

      const authorEncontrado = await AuthorsCollection.findOne({
        _id: new ObjectId(id),
      })

      if (!authorEncontrado) {
        throw new Error("Author no existe")
      }

      return {
        _id: authorEncontrado._id,
        name: authorEncontrado.name,
        lang: authorEncontrado.lang,
        books: authorEncontrado.books.map( (book) => new ObjectId(book))
      }
    }
    catch(error) {
        throw new Error(error);
    }
  },
  presshouse: async (_: unknown, args: { id: string }): Promise<PressHouseSchema> => {
    try {
      const { id } = args;

      const pressHouseEncontrado = await PressHousesCollection.findOne({
        _id: new ObjectId(id),
      })

      if (!pressHouseEncontrado) {
        throw new Error("Press house no existe")
      }

      return {
        _id: pressHouseEncontrado._id,
        name: pressHouseEncontrado.name,
        web: pressHouseEncontrado.web,
        country: pressHouseEncontrado.country,
        books: pressHouseEncontrado.books.map( (book) => new ObjectId(book))
      }
    }
    catch(error) {
        throw new Error(error);
    }
  },

};

/*
books: async (_: unknown, _args: {}): Promise<BookSchema[]> => {
  try {

  }
  catch(error) {
      throw new Error(error);
  }
},

book: async (_: unknown, args: { id: string }): Promise<BookSchema> => {

},

booksWithId: async (_: unknown, args: {ids: string[]}): Promise<BookSchema[]> => {
  
}
*/