import { BookCollection } from "../db/dbconnection.ts";
import { AuthorSchema, BookSchema } from "../db/schema.ts";


export const Author = {
    _id: (parent: AuthorSchema): string => parent._id.toString(),
    
    books: async (parent: AuthorSchema,): Promise<BookSchema[]> => {
        try {
            return await BookCollection.find({
                _id: {
                    $in: parent.books
                }
            }).toArray();
        }
        catch(error) {
            throw new Error(error);
        }
    },
}