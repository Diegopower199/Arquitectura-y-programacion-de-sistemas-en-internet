import { getQuery } from "oak/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { ObjectId } from "mongo";
import { PartidoSchema } from "../db/schema.ts";
import { PartidoCollection } from "../db/dbconnection.ts";

type GetPartidoContext = RouterContext<
  "/listMatches",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetPartidoConIDContext = RouterContext<
  "/getMatch/:id",{
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const listMatches = async (context: GetPartidoContext) => {
  try {
    const matches: PartidoSchema[] | undefined = await PartidoCollection.find({
      finalizacion: false
    }).toArray();

    if (matches) {
      context.response.body =  matches.map( (partido) => ({
        _id: partido._id,
        nombreEquipo1: partido.nombreEquipo1,
        nombreEquipo2: partido.nombreEquipo2,
        resultado: partido.resultado,
        minutoJuego: partido.minutoJuego,
        finalizacion: partido.finalizacion,
      }));
      
    } else {
      context.response.status = 404;
      context.response.body = [];
    }
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};

export const getMatch = async (context: GetPartidoConIDContext) => {
  try {
    const params = getQuery(context, {mergeParams: true});
    if (params?.id) {
      const partido: PartidoSchema | undefined = await PartidoCollection.findOne({
        _id: new ObjectId(params.id),
      });

      if (partido) {
        context.response.body = {
          _id: partido._id,
          nombreEquipo1: partido.nombreEquipo1,
          nombreEquipo2: partido.nombreEquipo2,
          resultado: partido.resultado,
          minutoJuego: partido.minutoJuego,
          finalizacion: partido.finalizacion,
        };
      } else {
        context.response.status = 404;
        context.response.body = { message: "Partido not found" };
      }
    }
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};
