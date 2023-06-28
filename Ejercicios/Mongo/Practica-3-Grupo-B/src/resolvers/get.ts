import { getQuery } from "oak/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { ObjectId } from "mongo";
import { BooksCollection, UserCollection } from "../db/dbconnection.ts";
import { BookSchema, UserSchema } from "../db/schema.ts";

type GetBooksContext = RouterContext<
  "/getBooks",
  Record<string | number, string | undefined>,
  Record<string, any>
>;




export const getBooks = async (context: GetBooksContext) => {
  try {
    const page = context.request.url.searchParams.get('page');
    const title = context.request.url.searchParams.get('title');


    if (page === null) {
      context.response.body = { msg: "Falta el parametro de page" };
      context.response.status = 400;
      return;
    }

    else if (!Number.isInteger(Number(page))) {
      context.response.body = { msg: "El parametro page no es tipo entero (number)" };
      context.response.status = 400;
      return;
    }
    
    else if (parseInt(page) < 0) {
      context.response.body = { msg: "El parametro page debe ser 0 o mas" };
      context.response.status = 400;
      return;
    }

    if (page !== null && title === null) {
      const booksPaginados: BookSchema[] = await BooksCollection.find({}).limit(10).skip(parseInt(page) * 10).toArray();

      context.response.body = booksPaginados.map( (book: BookSchema) => ({
        id: book._id,
        title: book.title,
        author: book.author,
        pages: book.pages,
        ISBN: book.ISBN,
      }));

      context.response.status = 200;
      return;
    }
    else if (page !== null && title !== null) {
      const booksPaginados: BookSchema[] = await BooksCollection.find({
        title: title,
      }).limit(10).skip(parseInt(page) * 10).toArray();

      context.response.body = booksPaginados.map( (book: BookSchema) => ({
        id: book._id,
        title: book.title,
        author: book.author,
        pages: book.pages,
        ISBN: book.ISBN,
      }));

      context.response.status = 200;
      return;
    }

  }

  catch(error) {
    console.log(error);
    context.response.status = 500;
  }
}


type GetUserConIdContext = RouterContext<"/getUser/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;


export const getUser = async (context: GetUserConIdContext) => {
  try {
    if (context.params?.id) {
      const id: string = context.params.id;

      const usuarioEncontrado: UserSchema | undefined = await UserCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!usuarioEncontrado) {
        context.response.body = { msg: "El usuario no existe con esa id" };
        context.response.status = 400;
        return;
      }


      context.response.body = { 
        _id: usuarioEncontrado._id,
        name: usuarioEncontrado.name,
        email: usuarioEncontrado.email,
        password: usuarioEncontrado.password,
        createAt: usuarioEncontrado.createAt,
        cart: usuarioEncontrado.cart
      };
      context.response.status = 200;
    }
    else {
      context.response.body = { msg: "No se ha introducido el parametro id" };
      context.response.status = 400;
      return;
    }
  }

  catch(error) {
    console.log(error);
    context.response.status = 500;
  }
}

