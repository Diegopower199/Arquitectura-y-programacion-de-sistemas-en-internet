import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { UserSchema } from "../db/schema.ts";
import { UsersCollection } from "../db/dbconnection.ts";

type DeleteAlgoConEmailContext = RouterContext<
  "/deleteUser/:email",
  {
    email: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const deleteUserConEmail = async (context: DeleteAlgoConEmailContext) => {
  try {
    if (context.params?.id) {
      const email = context.params.email;

      const deleteUsuario = await UsersCollection.deleteOne({
        email: email,
      });

      if (deleteUsuario === 0) {
        context.response.body = { msg: "El usuario no existe por lo que no se ha eliminado nada de la base de datos", };
        context.response.status = 400;
      }

      context.response.body = {
        msg: "Se ha eliminado correctamente el usuario",
      };
      context.response.status = 200;
    } 
    else {
      context.response.body = { msg: "Nos falta el parametro de email" };
      context.response.status = 404;
      return;
    }
  } catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};
