import { ObjectId } from "mongo";
import {
  AuthorCollection,
  BookCollection,
  PressHouseCollection,
} from "../db/dbconnection.ts";
import { BookSchema } from "../db/schema.ts";
import { AuthorSchema } from "../db/schema.ts";
import { PressHouseSchema } from "../db/schema.ts";

export const Mutation = {
  addPressHouse: async (
    _: unknown,
    args: { name: string; web: string; country: string; books: string[] }
  ): Promise<PressHouseSchema> => {
    try {
      const { name, web, country, books } = args;

      const pressHouseEncontrada: PressHouseSchema | undefined =
        await PressHouseCollection.findOne({
          name: name,
        });

      if (pressHouseEncontrada) {
        throw new Error("Ya tenemos esa informacion en una press House");
      }

      // Encontrar si existe todos los libros PORQUE SI NO TIENE QUE MOSTRAR UN ERROR
      const booksEncontrados: BookSchema[] = await BookCollection.find(
        {}
      ).toArray();
      const idsCollection: string[] = booksEncontrados.map((book) =>
        book._id.toString()
      );

      books.forEach((book) => {
        if (!idsCollection.includes(book)) {
          throw new Error(`El libro "${book}" no se encuentra en la colección`);
        }
      });

      const pressHouseCreate: ObjectId = await PressHouseCollection.insertOne({
        name: name,
        web: web,
        country: country,
        books: books.map((book) => new ObjectId(book)),
      });

      return {
        _id: pressHouseCreate,
        name: name,
        web: web,
        country: country,
        books: books.map((book) => new ObjectId(book)),
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  addAuthor: async (
    _: unknown,
    args: { name: string; lang: string; books: string[] }
  ): Promise<AuthorSchema> => {
    try {
      const { name, lang, books } = args;
      const authorEncontrado: AuthorSchema | undefined =
        await AuthorCollection.findOne({
          name: name,
        });

      if (authorEncontrado) {
        throw new Error("Author existente");
      }

      // Encontrar si existe todos los libros PORQUE SI NO TIENE QUE MOSTRAR UN ERROR

      const booksEncontrados: BookSchema[] = await BookCollection.find(
        {}
      ).toArray();
      const idsCollection: string[] = booksEncontrados.map((book) =>
        book._id.toString()
      );

      books.forEach((book) => {
        if (!idsCollection.includes(book)) {
          throw new Error(`El libro "${book}" no se encuentra en la colección`);
        }
      });

      const authorCreate: ObjectId = await AuthorCollection.insertOne({
        name: name,
        lang: lang,
        books: books.map((book) => new ObjectId(book)),
      });

      return {
        _id: authorCreate,
        name: name,
        lang: lang,
        books: books.map((book) => new ObjectId(book)),
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  addBook: async (
    _: unknown,
    args: { title: string; author: string; pressHouse: string; year: number }
  ): Promise<BookSchema> => {
    try {
      const { title, author, pressHouse, year } = args;
      const bookEncontrado: BookSchema | undefined =
        await BookCollection.findOne({
          title: title,
        });

      if (bookEncontrado) {
        throw new Error("Book existente");
      }

      const authorEncontrado: AuthorSchema | undefined =
        await AuthorCollection.findOne({
          _id: new ObjectId(author),
        });

      if (!authorEncontrado) {
        throw new Error("No existe ese id de author");
      }

      const pressHouseEncontrado: PressHouseSchema | undefined =
        await PressHouseCollection.findOne({
          _id: new ObjectId(pressHouse),
        });

      if (!pressHouseEncontrado) {
        throw new Error("No existe ese id de Press House");
      }

      // Actualizar en press house y author los nuevos libros que pertenecen en el array de books

      const bookCreate: ObjectId = await BookCollection.insertOne({
        title: title,
        author: new ObjectId(author),
        pressHouse: new ObjectId(pressHouse),
        year: year,
      });

      // Estos dos await los hago para actualizar en los dos tipos estos valores borrados
      await PressHouseCollection.updateOne(
        { _id: new ObjectId(pressHouse) },
        {
          $push: {
            books: {
              $each: [bookCreate],
            },
          },
        }
      );

      await AuthorCollection.updateOne(
        { _id: new ObjectId(author) },
        {
          $push: {
            books: {
              $each: [bookCreate],
            },
          },
        }
      );

      return {
        _id: bookCreate,
        title: title,
        author: new ObjectId(author),
        pressHouse: new ObjectId(pressHouse),
        year: year,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  deletePressHouse: async (
    _: unknown,
    args: { id: string }
  ): Promise<PressHouseSchema> => {
    try {
      const { id } = args;
      const pressHouseEncontrada: PressHouseSchema | undefined =
        await PressHouseCollection.findOne({
          _id: new ObjectId(id),
        });

      if (!pressHouseEncontrada) {
        throw new Error("No tenemos ese id de press House");
      }

      const pressHouseDelete = await PressHouseCollection.deleteOne({
        _id: new ObjectId(id),
      });

      return {
        _id: pressHouseEncontrada._id,
        name: pressHouseEncontrada.name,
        web: pressHouseEncontrada.web,
        country: pressHouseEncontrada.country,
        books: pressHouseEncontrada.books.map((book) => new ObjectId(book)),
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  deleteAuthor: async (
    _: unknown,
    args: { id: string }
  ): Promise<AuthorSchema> => {
    try {
      const { id } = args;
      const authorEncontrada: AuthorSchema | undefined =
        await AuthorCollection.findOne({
          _id: new ObjectId(id),
        });

      if (!authorEncontrada) {
        throw new Error("No tenemos ese id de un author");
      }

      const authorDelete = await AuthorCollection.deleteOne({
        _id: new ObjectId(id),
      });

      return {
        _id: authorEncontrada._id,
        name: authorEncontrada.name,
        lang: authorEncontrada.lang,
        books: authorEncontrada.books.map((book) => new ObjectId(book)),
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  deleteBook: async (_: unknown, args: { id: string }): Promise<BookSchema> => {
    try {
      const { id } = args;
      const bookEncontrada: BookSchema | undefined =
        await BookCollection.findOne({
          _id: new ObjectId(id),
        });

      if (!bookEncontrada) {
        throw new Error("No tenemos ese id de un libro");
      }

      const bookDelete = await BookCollection.deleteOne({
        _id: new ObjectId(id),
      });

      await PressHouseCollection.updateOne(
        { _id: bookEncontrada.pressHouse },
        {
          $pull: {
            books: bookEncontrada,
          },
        }
      );

      await AuthorCollection.updateOne(
        { _id: bookEncontrada.author },
        {
          $pull: {
            books: bookEncontrada,
          },
        }
      );

      console.log(bookEncontrada.pressHouse.toString());

      return {
        _id: bookEncontrada._id,
        title: bookEncontrada.title,
        author: bookEncontrada.author,
        pressHouse: bookEncontrada.pressHouse,
        year: bookEncontrada.year,
      };
    } catch (e) {
      throw new Error(e);
    }
  },

  updatePressHouse: async (
    _: unknown,
    args: { idPressHouse: string; name?: string; web: string; country: string }
  ): Promise<PressHouseSchema> => {
    try {
      const { idPressHouse, name, web, country } = args;

      const pressHouseEncontrada: PressHouseSchema | undefined =
        await PressHouseCollection.findOne({
          _id: new ObjectId(idPressHouse),
        });

      if (!pressHouseEncontrada) {
        throw new Error("No se ha encontrado ninguna press house");
      }

      const actualizarParametros: {
        name?: string;
        web: string;
        country: string;
      } = {
        web: web,
        country: country,
      };

      if (name) {
        actualizarParametros.name = name;
      }

      await PressHouseCollection.updateOne(
        { _id: new ObjectId(idPressHouse) },
        { $set: actualizarParametros }
      );

      return {
        _id: new ObjectId(idPressHouse),
        name: name || pressHouseEncontrada.name,
        web: web,
        country: country,
        books: pressHouseEncontrada.books.map((book) => new ObjectId(book)),
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  updateBooksMore2000: async (_: unknown, args: {}): Promise<number> => {
    try {
      const booksDelete: number = await BookCollection.deleteMany({
        year: {
          $lt: 2000,
        },
      });

      return booksDelete;
    } catch (error) {
      throw new Error(error);
    }
  },
  updateTitleBook: async (
    _: unknown,
    args: { title: string; titleNew: string }
  ): Promise<BookSchema> => {
    try {
      const { title, titleNew } = args;

      const bookEncontrado: BookSchema | undefined =
        await BookCollection.findOne({
          title: title,
        });

      if (!bookEncontrado) {
        throw new Error("No hay ningun libro con ese titulo");
      }

      await BookCollection.updateOne(
        { _id: bookEncontrado._id },
        {
          $set: {
            title: titleNew,
          },
        }
      );

      return {
        _id: bookEncontrado._id,
        title: titleNew,
        author: bookEncontrado.author,
        pressHouse: bookEncontrado.pressHouse,
        year: bookEncontrado.year,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
  updateAuthorOfTheBook: async (
    _: unknown,
    args: { authorDelete: string; authorAdd: string; title: string }
  ): Promise<BookSchema> => {
    try {

      const { authorDelete, authorAdd, title } = args;

      const authorEncontradoDelete: AuthorSchema | undefined =
        await AuthorCollection.findOne({
          _id: new ObjectId(authorDelete),
        });

      if (!authorEncontradoDelete) {
        throw new Error(
          "Author para eliminar de ese libro con esa id no encontrada"
        );
      }

      const authorEncontradoAdd: AuthorSchema | undefined =
        await AuthorCollection.findOne({
          _id: new ObjectId(authorAdd),
        });

      if (!authorEncontradoAdd) {
        throw new Error(
          "Author para añadir de ese libro con esa id no encontrada"
        );
      }

      const bookEncontradoPorAuthorAndTitle: BookSchema | undefined =
        await BookCollection.findOne({
          author: new ObjectId(authorDelete),
          title: title,
        });

      if (!bookEncontradoPorAuthorAndTitle) {
        throw new Error(
          "No se ha encontrado ningun libro con ese author o con ese titulo"
        );
      }

      await BookCollection.updateOne(
        { _id: new ObjectId(bookEncontradoPorAuthorAndTitle._id) },
        {
          $set: {
            author: new ObjectId(authorAdd),
          },
        }
      );

      await AuthorCollection.updateOne(
        { _id: new ObjectId(authorDelete) },
        {
          $pull: {
            books: new ObjectId(bookEncontradoPorAuthorAndTitle._id),
          },
        }
      );

      await AuthorCollection.updateOne(
        { _id: new ObjectId(authorAdd) },
        {
          $push: {
            books: {
              $each: [new ObjectId(bookEncontradoPorAuthorAndTitle._id)],
            },
          },
        }
      );

      return {
        _id: bookEncontradoPorAuthorAndTitle._id,
        title: bookEncontradoPorAuthorAndTitle.title,
        author: new ObjectId(authorAdd),
        pressHouse: bookEncontradoPorAuthorAndTitle.pressHouse,
        year: bookEncontradoPorAuthorAndTitle.year,
      };
    } catch (error) {
      throw new Error(error);
    }
  },
};
