import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { CocheCollection } from "../db/dbconnection.ts";
import { CocheSchema } from "../db/schema.ts";

type DeleteCocheConIdContext = RouterContext<
  "/removeCar/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const deleteCocheConID = async (context: DeleteCocheConIdContext) => {
  try {
    if (context.params?.id) {
      const id = context.params.id;

      const cocheEncontrado: CocheSchema | undefined =  await CocheCollection.findOne({
          _id: new ObjectId(id),
        });

      if (!cocheEncontrado) {
        context.response.body = { msg: "No se ha encontrado ningun coche con ese id", };
        context.response.status = 404;
        return;
      } 
      else if (cocheEncontrado.status === false) {
        context.response.status = 405;
        return;
      }

      await CocheCollection.deleteOne({
        _id: new ObjectId(id),
      });

      context.response.body = {
        msg: "Se ha eliminado correctamente",
        _id: cocheEncontrado?._id,
        matricula: cocheEncontrado?.matricula,
        numeroPlazas: cocheEncontrado?.numeroPlazas,
        status: cocheEncontrado?.status,
      };
      context.response.status = 200;
    } 
    else {
      context.response.body = { msg: "No se ha introducido el parametro id" };
      context.response.status = 400;
      return;
    }
  } 
  catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};
