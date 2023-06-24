import { ObjectId } from "mongo";
import { AuthorCollection, PressHouseCollection } from "../db/dbconnection.ts";
import { AuthorSchema, BookSchema, PressHouseSchema } from "../db/schema.ts";


export const Book = {
    _id: (parent: BookSchema): string => parent._id.toString(),
    pressHouse: async (parent: BookSchema): Promise<PressHouseSchema | undefined> => {
        try {
            return await PressHouseCollection.findOne({
                _id: new ObjectId(parent.pressHouse),
            })
        }
        catch (error) {
            throw new Error(error);
        }
    },
    author: async (parent: BookSchema): Promise<AuthorSchema | undefined> => {
        try {
            return await AuthorCollection.findOne({
                _id: new ObjectId(parent.author)
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
}


/*  ESTO DEBERIA FUNCIONAR BIEN
pressHouse: async (parent: BookSchema): Promise<PressHouseSchema | undefined> => {
        try {
            return await PressHouseCollection.findOne({
                _id: new ObjectId(parent._id)
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
*/