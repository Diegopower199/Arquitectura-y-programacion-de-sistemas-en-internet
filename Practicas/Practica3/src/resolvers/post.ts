import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { RouterContext } from "oak/router.ts";
import {
  AuthorsCollection,
  BooksCollection,
  UserCollection,
} from "../db/dbconnection.ts";
import { AuthorSchema, BooksSchema, UserSchema } from "../db/schema.ts";
import { Author, Books, User } from "../types.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";
import { v4 } from "https://deno.land/std@0.103.0/uuid/mod.ts";
import { isDBRefLike } from "https://deno.land/x/web_bson@v0.2.5/src/db_ref.ts";

type PostUserContext = RouterContext<
  "/addUser",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type PostBooksContext = RouterContext<
  "/addBook",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type PostAuthorContext = RouterContext<
  "/addAuthor",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const addUser = async (context: PostUserContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;
    if (!value?.name && !value?.email && !value?.password) {
      context.response.status = 400;
      return;
    }

    if (typeof value.name !== "string") {
      context.response.body =
        "Error, el name no tiene un formato correcto, debe ser string";
      context.response.status = 404;
      return;
    }

    if (typeof value.email !== "string") {
      context.response.body =
        "Error, el email no tiene un formato correcto, debe ser string";
      context.response.status = 404;
      return;
    }

    if (typeof value.password !== "string") {
      context.response.body =
        "Error, el password no tiene un formato correcto, debe ser string";
      context.response.status = 404;
      return;
    }

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value.email)) {
      context.response.body = "Formato email incorrecto";
      context.response.status = 400;
      return;
    }

    const comprobarEmail = await UserCollection.findOne({ email: value.email });
    if (comprobarEmail) {
      context.response.body = "El email ya existe";
      context.response.status = 400;
      return;
    }

    const hash = await bcrypt.hashSync(value.password); // Funcion para encriptar la contraseña

    const user: Partial<User> = {
      name: value.name,
      email: value.email,
      password: hash,
      createdAt: new Date(),
      cart: [],
    };

    const id = await UserCollection.insertOne(user as UserSchema);
    context.response.body = {
      name: user.name,
      email: user.email,
      password: hash,
      createdAt: user.createdAt,
      cart: user.cart,
    };
  } catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};

export const addBook = async (context: PostBooksContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;
    if (!value?.title && !value?.author && !value?.pages) {
      context.response.status = 400;
      return;
    }

    if (typeof value.title !== "string") {
      context.response.body =
        "Error, el title no tiene un formato correcto, debe ser string";
      context.response.status = 404;
      return;
    }

    if (typeof value.author !== "string") {
      context.response.body =
        "Error, el author no tiene un formato correcto, debe ser string";
      context.response.status = 404;
      return;
    }

    if (typeof value.pages !== "number") {
      context.response.body = "Error, el pages no tiene un formato correcto, debe ser number";
      context.response.status = 404;
      return;
    }

    const a = await AuthorsCollection.findOne({_id: new ObjectId(value._id)});

    console.log(a);

    const autor = await AuthorsCollection.findOne({
      name: value.author, 
    });

    console.log(autor?._id)

    if (autor) {
      // Generate a v4 UUID. For this we use the browser standard `crypto.randomUUID` function.
      const myUUID = crypto.randomUUID();

      // Validate the v4 UUID.
      const isValid = v4.validate(myUUID);

      if (!isValid) {
        context.response.body = "ISBN no válido";
        context.response.status = 400;
        return;
      }

      // SI EXISTE EL AUTOR DEBO AÑADIRLO TAMBIEN EL STRING DE AUTORES QUE ES UN STRING

      const book: Partial<Books> = {
        title: value.title,
        author: value.author,
        pages: value.pages,
        ISBN: myUUID.toString(),
      };

      const id = await BooksCollection.insertOne(book as BooksSchema);
      context.response.body = {
        title: book.title,
        author: book.author,
        pages: book.pages,
        ISBN: book.ISBN,
      };

      //console.log(id, "                     ", autor._id);

      const count = await AuthorsCollection.updateOne(
        { _id: new ObjectId(autor._id) },
        {
          $push: { // https://www.mongodb.com/docs/manual/reference/operator/update/push/
            books: id
          },
        },
      );

    }
    else {
      context.response.body = "Error, no existe el autor";
      context.response.status = 404;
      return;
    }

  } 
  
  catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};

export const addAuthor = async (context: PostAuthorContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;
    if (!value?.name) {
      context.response.status = 400;
      return;
    }

    if (typeof value.name !== "string") {
      context.response.body = "Error, el nombre no tiene un formato correcto, debe ser string";
      context.response.status = 404;
      return;
    }

    const books = await BooksCollection.find({ author: value.name }).toArray();

    const author: Partial<Author> = {
      name: value.name,
      books: books.map((book: BooksSchema) =>
        new ObjectId(book._id).toString()
      ),
    };

    const id = await AuthorsCollection.insertOne(author as AuthorSchema);
    context.response.body = {
      name: author.name,
      books: author.books,
    };
  } catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};
