import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { CocheCollection } from "../db/dbconnection.ts";
import { CocheSchema } from "../db/schema.ts";


type DeleteCocheConIdContext = RouterContext<"/removeCar/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const deleteCocheConID = async (context: DeleteCocheConIdContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });

    if (!params.id) {
      context.response.body = { msg: "No falta el parametro id" };
      context.response.status = 400;
    }
    const { id } = params;

    const cocheEncontrado: CocheSchema | undefined = await CocheCollection.findOne({
      _id: new ObjectId(id),
    })

    if (!cocheEncontrado) {
      //context.response.body = { msg: "No se ha encontrado ningun coche con ese id" }
      context.response.status = 404;
    }
    else if (cocheEncontrado.status === false) {
      context.response.status = 405;
    }

    await CocheCollection.deleteOne({
      _id: new ObjectId(id),
    });

    context.response.body = {
      msg: "Se ha eliminado correctamente",
      _id: cocheEncontrado?._id,
      matricula: cocheEncontrado?.matricula,
      numeroPLazas: cocheEncontrado?.numeroPLazas,
      status: cocheEncontrado?.status
    };
    context.response.status = 200;
  }

  catch(error) {
    console.log(error);
    context.response.status = 500;
  }
};


