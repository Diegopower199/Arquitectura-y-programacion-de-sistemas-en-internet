import { ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { BooksSchema } from "../db/schemas.ts";
import { Books } from "../types.ts";
import { BooksCollection } from "../db/mongo.ts";
import { v4 } from "std/uuid/mod.ts";
import { AuthorCollection } from "../db/mongo.ts";
import { AuthorSchema } from "../db/schemas.ts";

type PostAddBooksContext = RouterContext<
  "/addBook/:id",
  {
  id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postBooks = async (context: PostAddBooksContext) => {
  try {
    if(context.params?.id){
      //Busca el autor para luego poder añadirlo en su array
      const findauthor: AuthorSchema | undefined = await AuthorCollection.findOne({
        _id: new ObjectId(context.params.id),
      });

      if(findauthor){
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (!value?.title || !value?.author || !value?.pages) {
          context.response.status = 400;
          return;
        }
        // Generate a v4 UUID. For this we use the browser standard `crypto.randomUUID`
        // function.
        const myUUID = crypto.randomUUID();
  
        // Validate the v4 UUID.
        const isValid = v4.validate(myUUID);
  
        const book: Partial<Books> = {
          title: value.title,
          author: value.author,
          pages: value.pages,
          ISBN: myUUID,
        };

        await BooksCollection.insertOne(book as BooksSchema);
        const { _id, ...booksWithoutId } = book as BooksSchema;
        context.response.body = booksWithoutId;

        //Añadimos al array del autor
        findauthor.books.push(_id);
        await AuthorCollection.updateOne(
          {
            _id: findauthor._id,
          },
          {
            $set: {
                books: findauthor.books,
            },
          }
        )
      }else{
        context.response.status = 404;
        context.response.body = { message: "user not found to add book" };
      }
    }
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};
