import { AuthorsCollection, PressHouseCollection } from "../db/dbconnection.ts";
import { AuthorSchema, BookSchema, PressHouseSchema } from "../db/schema.ts";
export const Book = {
    id: (parent: BookSchema): string => parent._id.toString(),
    author: async (parent: BookSchema): Promise<AuthorSchema | undefined> => {
        try {
          const author = await AuthorsCollection.findOne({
            books: parent._id,
          });
          return author;
        } catch (e) {
          throw new Error(e);
        }
      },
      pressHouse: async (parent: BookSchema): Promise<PressHouseSchema | undefined> => {
        try {
          const pressHouse = await PressHouseCollection.findOne({
            books: parent._id,
          });
          return pressHouse;
        } catch (e) {
          throw new Error(e);
        }
      },
}
