import { ObjectId } from "mongo";
import { MatchCollection } from "../db/dbconnection.ts";
import { MatchSchema } from "../db/schema.ts";
import { } from "../types.ts";

export const Query = {
    listMatches: async (_: unknown, args: { }, ): Promise<MatchSchema[]> => {
        try {
            const matches: MatchSchema[] | undefined = await MatchCollection.find({
                finalizacion: false,
            }).toArray();

            
            return matches.map((match: MatchSchema) => ({
                _id: match._id,
                nombreEquipo1: match.nombreEquipo1,
                nombreEquipo2: match.nombreEquipo2,
                resultado: match.resultado,
                minutoJuego: match.minutoJuego,
                finalizacion: match.finalizacion,
            }));

        }

        catch(e) {
            throw new Error(e);
        }
    },

    getMatch: async (_: unknown, args: {id: string}, ): Promise<MatchSchema> => {
        const match: MatchSchema | undefined = await MatchCollection.findOne({
            _id: new ObjectId(args.id),
        });

        if (!match) {
            throw new Error("No existe el partido");
        }

        return {
            _id: match._id,
            nombreEquipo1: match.nombreEquipo1,
            nombreEquipo2: match.nombreEquipo2,
            resultado: match.resultado,
            minutoJuego: match.minutoJuego,
            finalizacion: match.finalizacion,
        }




    }
  
};
