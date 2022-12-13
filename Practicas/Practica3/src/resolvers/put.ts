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

type PutUpdateCartContext = RouterContext<
  "/updateCart",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const updateCart = async (context: PutUpdateCartContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;
    if (!value?.id_book && !value?.id_user) {
      context.response.status = 400;
      return;
    }

    if (typeof value.id_book !== "string") {
      context.response.body =
        "Error, el id_book no tiene un formato correcto, debe ser string";
      context.response.status = 404;
      return;
    }

    if (typeof value.id_user !== "string") {
      context.response.body =
        "Error, el id_user no tiene un formato correcto, debe ser string";
      context.response.status = 404;
      return;
    }

    const { id_user, id_book } = {
      id_book: value?.id_book,
      id_user: value?.id_user
  }


    const userEncontrado = await UserCollection.findOne({
      _id: new ObjectId(id_user),
    });

    const bookEncontrado = await BooksCollection.findOne({
      _id: new ObjectId(id_book),
    });


    if (!userEncontrado || !bookEncontrado) {
        context.response.body = "Usuario o libro introducido no existente"
        context.response.status = 404
        return;
    }

    

    const bookEncontradoEnUser  = await userEncontrado.cart.find((bookEncontradoEnUser:UserSchema) =>  bookEncontradoEnUser === id_book);


    console.log(bookEncontradoEnUser)

    if(bookEncontradoEnUser){
      context.response.body = "Libro ya en el carro del usuario"
      context.response.status = 400;
      return;
  }

    const count = await UserCollection.updateOne(
      { _id: new ObjectId(id_user) },
      {
        $push: { // https://www.mongodb.com/docs/manual/reference/operator/update/push/
          cart: id_book
        },
      },
    );

    if (count) {
        const user = await UserCollection.findOne({
          _id: new ObjectId(id_user),
        });
        context.response.body = {
            name: user.name,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
            cart: user.cart,
        };
        context.response.status = 200;
      } else {
        context.response.status = 404;
      }

  } 
  catch (error) {
    console.error(error);
    context.response.status = 500;
  }
};