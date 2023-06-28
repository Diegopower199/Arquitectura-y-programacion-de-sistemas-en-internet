import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { CocheCollection } from "../db/dbconnection.ts";
import { CocheSchema } from "../db/schema.ts";

type PostCocheContext = RouterContext<
  "/addCar",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postCoche = async (context: PostCocheContext) => {
  try {
    const params = context.request.body({ type: "json" });
    const value = await params.value;

    const { matricula, numeroPlazas } = value;

    if (typeof matricula !== "string") {
      context.response.body = { msg: "La matricula no es de tipo string" };
      context.response.status = 400;
      return;
    }

    if (typeof numeroPlazas !== "number" || !Number.isInteger(numeroPlazas)) {
      context.response.body = {
        msg: "El número de plazas no es de tipo entero (number)",
      };
      context.response.status = 400;
      return;
    }

    

    const expresionRegularMatricula = /^[0-9]{1,4}(?!.*(LL|CH))[BCDFGHJKLMNPRSTVWXYZ]{3}$/;

    if (matricula.match(expresionRegularMatricula) === null) {
      context.response.body = { msg: "Esa matricula tiene un formato incorrecto", };
      context.response.status = 400;
      return;
    }

    const cocheEncontrado: CocheSchema | undefined = await CocheCollection.findOne({
        matricula: matricula,
      });

    if (cocheEncontrado) {
      context.response.body = { msg: "Esa matricula ya la esta utilizando otro coche", };
      context.response.status = 400;
      return;
    }

    const addCoche: ObjectId = await CocheCollection.insertOne({
      matricula: matricula,
      numeroPlazas: numeroPlazas,
      status: true,
    });

    context.response.body = {
      msg: "Se ha añadido correctamente",
      _id: addCoche,
      matricula: matricula,
      numeroPlazas: numeroPlazas,
      status: true,
    };
    context.response.status = 200;
  } 
  catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};
