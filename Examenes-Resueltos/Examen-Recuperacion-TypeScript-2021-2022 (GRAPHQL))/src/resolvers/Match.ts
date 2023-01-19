import { MatchSchema } from "../db/schema.ts";

export const Match = {
    id: (parent: MatchSchema): string => parent._id.toString(),
}
