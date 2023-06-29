import { BooksCollection } from "../db/dbconnection.ts";
import { BookSchema, PressHouseSchema } from "../db/schema.ts";


export const PressHouse = {
    _id: (parent: PressHouseSchema): string => parent._id.toString(),
    books: async (parent: PressHouseSchema,): Promise<BookSchema[]> => {
        try {
            return await BooksCollection.find({
                _id: {
                    $in: parent.books
                }
            }).toArray();
        }
        catch (error) {
            throw new Error(error);
        }
    }
}