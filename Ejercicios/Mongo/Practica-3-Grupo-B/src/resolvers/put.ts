import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { BookSchema, UserSchema } from "../db/schema.ts";
import { BooksCollection, UserCollection } from "../db/dbconnection.ts";


type PutUpdateCartContext = RouterContext<
  "/updateCart",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const putUpdateCart = async (context: PutUpdateCartContext) => {
  try {
    const params = context.request.body({ type: "json" });
    const value = await params.value;

    if (!value.id_book || !value.id_user) {
      context.response.body = { msg: "Falta el campo de id_book o id_user" };
      context.response.status = 400;
      return;
    }

    const { id_book, id_user } = value;

    const bookExiste: BookSchema | undefined = await BooksCollection.findOne({
      _id: new ObjectId(id_book)
    });

    if (!bookExiste) {
      context.response.body = { msg: "Este libro no existe en la base de datos" };
      context.response.status = 400;
      return;
    }

    const usuarioExiste: UserSchema | undefined = await UserCollection.findOne({
      _id: new ObjectId(id_user)
    });

    if (!usuarioExiste) {
      context.response.body = { msg: "Este usuario no existe en la base de datos" };
      context.response.status = 400;
      return;
    }

    await UserCollection.updateOne(
      {_id: new ObjectId(id_user)},
      {
        $push: {
          cart: {
            $each: [new ObjectId(id_book)]
          }
        }
      }
    );

    context.response.body = { msg: "Se ha actualizado el carrito del usuario" };
    context.response.status = 200;
    
  }

  catch(error) {
    console.log(error);
    context.response.status = 500;
  }
}