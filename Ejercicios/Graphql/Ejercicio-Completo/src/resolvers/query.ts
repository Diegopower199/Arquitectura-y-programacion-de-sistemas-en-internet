import { ObjectId } from "mongo";
import { AuthorCollection, BookCollection, PressHouseCollection } from "../db/dbconnection.ts";
import { PressHouseSchema } from "../db/schema.ts";
import { AuthorSchema } from "../db/schema.ts";
import { BookSchema } from "../db/schema.ts";

export const Query = {
  books: async (_: unknown, args: {}): Promise<BookSchema[]> => {
    try {
      const booksEncontrados: BookSchema[] = await BookCollection.find({}).toArray();

      if (!booksEncontrados) {
        throw new Error("No existen libros");
      }

      return booksEncontrados.map((book: BookSchema) => ({
        _id: book._id,
        title: book.title,
        author: book.author,
        pressHouse: book.pressHouse,
        year: book.year,
      }));
    } catch (e) {
      throw new Error(e);
    }
  },
  authors: async (_: unknown, args: {}): Promise<AuthorSchema[]> => {
    try {
        const authorsEncontrados: AuthorSchema[] = await AuthorCollection.find({}).toArray();

        if (!authorsEncontrados) {
            throw new Error ("No existe ningun author");
        }

        return authorsEncontrados.map( (author: AuthorSchema) => ({
            _id: author._id,
            name: author.name,
            lang: author.lang,
            books: author.books.map((book) => new ObjectId(book))
        }));
    } 
    catch (e) {
      throw new Error(e);
    }
  },
  presshouses: async (_: unknown, args: {}): Promise<PressHouseSchema[]> => {
    try {
        const pressHouseEncontrados: PressHouseSchema[] = await PressHouseCollection.find({}).toArray();

        if (!pressHouseEncontrados) {
            throw new Error ("No existe ningun press house")
        }
        
        return pressHouseEncontrados.map( (pressHouse: PressHouseSchema) => ({
            _id: pressHouse._id,
            name: pressHouse.name,
            web: pressHouse.web,
            country: pressHouse.country,
            books: pressHouse.books.map((book) => new ObjectId(book)),
        }));

    } catch (e) {
      throw new Error(e);
    }
  },

  book: async (_: unknown, args: { id: string }): Promise<BookSchema> => {
    try {
        const {id} = args;
        const bookEncontrados: BookSchema | undefined = await BookCollection.findOne({
          id: new ObjectId(id)
        });

        if (!bookEncontrados) {
          throw new Error ("Libro con id no encontrado");
        }

        return {
          _id: bookEncontrados._id,
          title: bookEncontrados.title,
          author: bookEncontrados.author,
          pressHouse: bookEncontrados.pressHouse,
          year: bookEncontrados.year,
        };
    } 
    catch (e) {
      throw new Error(e);
    }
  },
  author: async (_: unknown, args: { id: string }): Promise<AuthorSchema> => {
    try {
        const {id} = args;
        const authorEncontrados: AuthorSchema | undefined = await AuthorCollection.findOne({
          id: new ObjectId(id)
        });

        if (!authorEncontrados) {
          throw new Error ("Author con id no encontrado");
        }

        return {
          _id: authorEncontrados._id,
          name: authorEncontrados.name,
          lang: authorEncontrados.lang,
          books: authorEncontrados.books.map((book) => new ObjectId(book)),
        }
    } 
    catch (e) {
      throw new Error(e);
    }
  },
  presshouse: async (_: unknown, args: { id: string }): Promise<PressHouseSchema> => {
    try {
        const {id} = args;
        const pressHouseEncontrados: PressHouseSchema | undefined = await PressHouseCollection.findOne({
          id: new ObjectId(id)
        });

        if (!pressHouseEncontrados) {
          throw new Error ("Author con id no encontrado");
        }

        return {
          _id: pressHouseEncontrados._id,
          name: pressHouseEncontrados.name,
          web: pressHouseEncontrados.web,
          country: pressHouseEncontrados.country,
          books: pressHouseEncontrados.books.map((book) => new ObjectId(book)),
        }
        
    } 
    catch (e) {
      throw new Error(e);
    }
  },

  booksWithId: async (_: unknown, args: {ids: string[]}): Promise<BookSchema[]> => {
    try {
      const {ids} = args;


      const booksPromesas = ids.map ( async (id) => {
        const bookEncontrado: BookSchema | undefined  = await BookCollection.findOne({_id: new ObjectId(id)});

        if (!bookEncontrado) {
          throw new Error (`Esta id: ${id} no esta en la base de datos`);
        }

        return bookEncontrado;
      });

      console.log("BOOKS PROMESAS (Abajo lo que hago es esperar a que se completen): ", booksPromesas)

      const booksEncontrados = await Promise.all(booksPromesas);

      return booksEncontrados.map((book: BookSchema) => ({
        _id: book._id,
        title: book.title,
        author: book.author,
        pressHouse: book.pressHouse,
        year: book.year,
      }));
    }

    catch(error) {
      throw new Error (error);
    }
  },
  authorsWithId: async (_: unknown, args: {ids: string[]}): Promise<AuthorSchema[]> => {
    try {
      const {ids} = args;

      const authorsPromesas = ids.map ( async (id) => {
        const authorEncontrado: AuthorSchema | undefined  = await AuthorCollection.findOne({_id: new ObjectId(id)});

        if (!authorEncontrado) {
          throw new Error (`Esta id: ${id} no esta en la base de datos`);
        }

        return authorEncontrado;
      });

      console.log("Authors PROMESAS (Abajo lo que hago es esperar a que se completen): ", authorsPromesas)

      const authorsEncontrados = await Promise.all(authorsPromesas);

      return authorsEncontrados.map( (author: AuthorSchema) => ({
        _id: author._id,
        name: author.name,
        lang: author.lang,
        books: author.books.map((book) => new ObjectId(book)),
      }));
    }

    catch(error) {
      throw new Error (error);
    }
  },
  pressHousesWithId: async (_: unknown, args: {ids: string[]}): Promise<PressHouseSchema[]> => {
    try {
      const {ids} = args;

      const pressHousePromesas = ids.map ( async (id) => {
        const pressHouseEncontrado: PressHouseSchema | undefined  = await PressHouseCollection.findOne({_id: new ObjectId(id)});

        if (!pressHouseEncontrado) {
          throw new Error (`Esta id: ${id} no esta en la base de datos`);
        }

        return pressHouseEncontrado;
      });

      console.log("Press House PROMESAS (Abajo lo que hago es esperar a que se completen): ", pressHousePromesas)

      const pressHouseEncontrados = await Promise.all(pressHousePromesas);

      return pressHouseEncontrados.map( (pressHouse: PressHouseSchema) => ({
        _id: pressHouse._id,
        name: pressHouse.name,
        web: pressHouse.web,
        country: pressHouse.country,
        books: pressHouse.books.map((book) => new ObjectId(book)),
    }));
    }

    

    catch(error) {
      throw new Error (error);
    }
  }


};
