import { AuthorsCollection, PressHousesCollection } from "../db/dbconnection.ts";
import { AuthorSchema, BookSchema, PressHouseSchema } from "../db/schema.ts";


export const Book = {
    _id: (parent: BookSchema): string => parent._id.toString(),
    author: async (parent: BookSchema): Promise<AuthorSchema> => {
        try {
          const author = await AuthorsCollection.findOne({ _id: parent.author });
          if (!author) {
            throw new Error("author not found");
          }
          return author;
        } catch (e) {
          throw new Error(e);
        }
      },
      pressHouse: async (parent: BookSchema): Promise<PressHouseSchema> => {
        try {
          const pressHouse = await PressHousesCollection.findOne({ _id: parent.pressHouse });
          if (!pressHouse) {
            throw new Error("Press House not found");
          }
          return pressHouse;
        } catch (e) {
          throw new Error(e);
        }
      },
}
