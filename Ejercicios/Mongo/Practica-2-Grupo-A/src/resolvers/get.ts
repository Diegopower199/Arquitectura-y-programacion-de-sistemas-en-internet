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
    const params = getQuery(context, { mergeParams: true });
    if (!params.id) {
      context.response.body = { msg: "Falta el parametro id" };
      context.response.status = 400;
    }
    
    const { id } = params;

    const cocheEncontrado: CocheSchema | undefined = await CocheCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!cocheEncontrado) {
      context.response.body = { msg: "El id del coche no existe" };
      context.response.status = 400;
    }

    context.response.body = {
      _id: cocheEncontrado?._id,
      matricula: cocheEncontrado?.matricula,
      numeroPlazas: cocheEncontrado?.numeroPLazas,
      status: cocheEncontrado?.status,
    }
    context.response.status = 200;
  } 
  catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};

