import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { UserSchema } from "../db/schema.ts";
import { UserCollection } from "../db/dbconnection.ts";


type DeleteUserConIdContext = RouterContext<"/deleteUser/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const deleteUserConID = async (context: DeleteUserConIdContext) => {
  try {
    if (context.params?.id) {
      const id = context.params.id;

      const userExiste: UserSchema | undefined = await UserCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!userExiste) {
        context.response.body = { msg: "El usuario con ese id no existe" };
        context.response.status = 400;
        return;
      }

      await UserCollection.deleteOne({
        _id: new ObjectId(id),
      });

      context.response.body = { msg: "El usuario se ha eliminado correctamente" };
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
};

