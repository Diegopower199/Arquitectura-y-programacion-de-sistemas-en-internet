import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { BooksCollection } from "../db/mongo.ts";
import { BooksSchema } from "../db/schemas.ts";

type GetBooksContext = RouterContext<
  "/getBooks",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getBooks = async (context: GetBooksContext) => {
 try{ const params = getQuery(context, { mergeParams: true });
    const limit = 10;
    const total = await BooksCollection.count();
    const pages = Math.ceil(total / limit);
    const page = params.page ? parseInt(params.page) : 1;
    //get by title
    if (params.page && params.title) {
      const books = await BooksCollection.find({
        title: params.title,
      }).limit(limit)
        .skip((page - 1) * limit)
        .toArray();

      context.response.body ={
        books,
        page,
      } 
    }else {
      //get all
      const books: BooksSchema[] = await BooksCollection.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .toArray();
        context.response.body = {
          books,
          page,
          pages,
          totalBooks: total,
      };

    }
  }catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};


  

 

