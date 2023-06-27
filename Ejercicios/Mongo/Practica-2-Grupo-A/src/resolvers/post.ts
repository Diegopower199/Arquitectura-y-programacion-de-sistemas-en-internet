import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { CocheCollection } from "../db/dbconnection.ts";

type PostCocheContext = RouterContext<
  "/addCar",
  Record<string | number, string | undefined>,
  Record<string, any>
>;


export const postCoche = async (context: PostCocheContext) => {
  try {
    const params = context.request.body( { type: "json" });
    const value = await params.value;

    const { matricula, numeroPLazas } = value;

    const expresionRegularMatricula = /^[0-9]{1,4}(?!.*(LL|CH))[BCDFGHJKLMNPRSTVWXYZ]{3}$/;


    if (matricula.match(expresionRegularMatricula) === null) {
      context.response.body = { msg: "Esa matricula tiene un formato incorrecto"}
      context.response.status = 400;
    }

    const cocheEncontrado = await CocheCollection.findOne({
      matricula: matricula,
    })

    if (cocheEncontrado) {
      context.response.body = { msg: "Esa matricula ya la esta utilizando otro coche" }
      context.response.status = 400;
    }

    const addCoche: ObjectId = await CocheCollection.insertOne({
      matricula: matricula,
      numeroPLazas: numeroPLazas,
      status: true,
    });

    context.response.body = {
      msg: "Se ha añadido correctamente",
      _id: addCoche,
      matricula: matricula,
      numeroPLazas: numeroPLazas,
      status: true,
    }
    context.response.status = 200;
  }

  catch(error) {
    console.log(error);
    context.response.status = 500;
  }
}


