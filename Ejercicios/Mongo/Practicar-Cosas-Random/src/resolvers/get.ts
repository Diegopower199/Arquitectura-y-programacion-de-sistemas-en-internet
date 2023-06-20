import { getQuery } from "oak/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { ObjectId } from "mongo";
import { UserSchema } from "../db/schema.ts";
import { UsersCollection } from "../db/dbconnection.ts";

type GetUserContext = RouterContext<
  "/getUser/:parametro", {
    parametro: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;


export const getUserWithParameters = async (context: GetUserContext) => {
  try {
    const parametro: string = context.params.parametro;
    const userEncontrado: UserSchema | undefined = await UsersCollection.findOne({
      $or: [ {dni: parametro}, {email: parametro}, {iban: parametro}, {telefono: parametro}, {_id: new ObjectId(parametro)}]
    });

    if (!userEncontrado) {
      context.response.body = { msg: "No se ha encontrado el usuario" };
      context.response.status = 404;
      return;
    }

    context.response.body = userEncontrado;
    context.response.status = 200;
    

  }

  catch(error) {
    console.log(error);
    context.response.status = 500;
  }
}