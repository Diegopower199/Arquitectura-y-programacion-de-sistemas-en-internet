import { getQuery } from "oak/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { ObjectId } from "mongo";
import { UserSchema } from "../db/schema.ts";
import { UsersCollection } from "../db/dbconnection.ts";

type GetUserConParametroContext = RouterContext<
  "/getUser/:parametro",
  {
    parametro: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getUser = async (context: GetUserConParametroContext) => {
  try {
    if (context.params?.id) {
      const parametro = context.params.parametro;

      const expresionRegularObjectId = /^[0-9a-fA-F]{24}$/;

      let usuarioEncontrado: UserSchema | undefined;

      if (parametro.match(expresionRegularObjectId) !== null) { // Esto significa que es un ObjectId
        usuarioEncontrado = await UsersCollection.findOne({
          _id: new ObjectId(parametro),
        });
      } 
      else {
        usuarioEncontrado = await UsersCollection.findOne({
          $or: [
            { dni: parametro },
            { telefono: parametro },
            { email: parametro },
            { IBAN: parametro },
          ],
        });
      }

      if (!usuarioEncontrado) {
        context.response.body = { msg: "El usuario con el parametro que has pasado no existe", };
        context.response.status = 400;
        return;
      }

      context.response.body = {
        _id: usuarioEncontrado._id,
        dni: usuarioEncontrado.dni,
        nombre: usuarioEncontrado.nombre,
        apellido: usuarioEncontrado.apellido,
        telefono: usuarioEncontrado.telefono,
        email: usuarioEncontrado.email,
        IBAN: usuarioEncontrado.IBAN,
      };
      context.response.status = 200;
    } 
    else {
      context.response.body = { msg: "Nos falta el parametro con valor unico que no has introducido ", };
      context.response.status = 404;
      return;
    }
  } 
  catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};
