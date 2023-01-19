import { ObjectId } from "mongo";
import { MatchCollection } from "../db/dbconnection.ts";
import { MatchSchema } from "../db/schema.ts";
import { } from "../types.ts";

export const Query = {
    listMatches: async (_: unknown, args: { }, ): Promise<MatchSchema[]> => {
        try {
            const matches: MatchSchema[] | undefined = await MatchCollection.find({}).toArray();

            return matches.map

        }

        catch(e) {
            throw new Error(e);
        }
    },
    getMatch: async (_: unknown, args: {id: string}, ): Promise<MatchSchema> => {

    }
  
};
