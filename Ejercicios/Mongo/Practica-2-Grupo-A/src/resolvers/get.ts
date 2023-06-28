import { getQuery } from "oak/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { ObjectId } from "mongo";
import { CocheCollection } from "../db/dbconnection.ts";
import { CocheSchema } from "../db/schema.ts";

type GetCocheContext = RouterContext<
  "/car/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getCar = async (context: GetCocheContext) => {
  try {
    if (context.params?.id) {
      const id = context.params.id;

      const cocheEncontrado: CocheSchema | undefined = await CocheCollection.findOne({
          _id: new ObjectId(id),
        });

      if (!cocheEncontrado) {
        context.response.body = { msg: "El id del coche no existe" };
        context.response.status = 400;
        return;
      }

      context.response.body = {
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
