import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { CocheCollection } from "../db/dbconnection.ts";
import { CocheSchema } from "../db/schema.ts";

type UpdateAskCarContext = RouterContext<
  "/askCar",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const putAskCar = async (context: UpdateAskCarContext) => {
  try {
    const coche: CocheSchema | undefined = await CocheCollection.findOne({
      status: true,
    });

    if (!coche) {
      context.response.body = { msg: "No hay coches libres" };
      context.response.status = 404;
      return;
    }

    await CocheCollection.updateOne(
      { _id: new ObjectId(coche?._id) },
      {
        $set: {
          status: false,
        },
      }
    );

    context.response.body = {
      _id: coche._id,
      matricula: coche.matricula,
      numeroPlazas: coche.numeroPlazas,
      status: false,
    };
    context.response.status = 200;
  } 
  catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};

type UpdateReleaseCarContext = RouterContext<
  "/releaseCar/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const putReleaseCar = async (context: UpdateReleaseCarContext) => {
  try {
    if (context.params?.id) {
      const id = context.params.id;

      const cocheEncontrado: CocheSchema | undefined = await CocheCollection.findOne({
          _id: new ObjectId(id),
        });

      if (!cocheEncontrado) {
        context.response.body = { msg: "El usuario id no se ha encontrado" };
        context.response.status = 404;
        return;
      }

      if (cocheEncontrado?.status === false) {
        context.response.body = { msg: "EL coche esta ocupado con esta id" };
        context.response.status = 400;
        return;
      }

      if (cocheEncontrado?.status === true) {
        await CocheCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              status: false,
            },
          }
        );

        context.response.body = { msg: "Se ha actualizado el status del coche", };
        context.response.status = 200;
        return;
      }
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
