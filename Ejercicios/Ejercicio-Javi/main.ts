import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

type GuntedexApiRest = {
  count: number;
  next: string | null;
  previous: string | null;
  results: BookAPI[];
};

type BookAPI = {
  id: number;
  title: string;
  authors: AuthorsAPI[];
  translators: string[];
  subjects: string[];
};

type AuthorsAPI = {
  name: string;
  birth_year: number;
  death_year: number;
};

const router = new Router();

router
  .get("/books", async (context) => {
    try {
      const response = await fetch(`https://gutendex.com/books/?page=1`);
      const booksJSON: GuntedexApiRest = await response.json();

      const books: BookAPI[] = booksJSON.results;

      const allInformation = books.map((book: BookAPI) => ({
        id: book.id,
        title: book.title
      }))

      context.response.body = allInformation;
      context.response.status = 200;
    } catch (error) {
      console.log(error);
      context.response.body = { msg: "Error" };
      context.response.status = 500;
    }
  })
  .get("/books/:page", async (context) => {
    try {
      const params = getQuery(context, { mergeParams: true });

      if (!params.page) {
        context.response.status = 404;
        return;
      }

      const { page } = params;

      const response = await fetch(`https://gutendex.com/books/?page=${page}`);
      const booksJSON: GuntedexApiRest = await response.json();

      const books: BookAPI[] = booksJSON.results;

      const allInformation = books.map((book: BookAPI) => ({
        id: book.id,
        title: book.title
      }))


      context.response.body = allInformation;
      context.response.status = 200;
    } 
    catch (error) {
      console.log(error);
      context.response.body = { msg: "Error" };
      context.response.status = 500;
    }
  })
  .get("/book/:id", async (context) => {
    try {
        const params = getQuery(context, { mergeParams: true });

        console.log(context.params.id)

        console.log(params)

        if (!params.id) {
          context.response.status = 404;
          return;
        }
  
        const { id } = params;
        console.log(id)
        const response = await fetch(`https://gutendex.com/books/${parseInt(id)}`);
        const book: BookAPI = await response.json();
        console.log(book)
        if (book) {
            const { id, title, authors } = book;
            context.response.body = {
                id: book.id,
                title: book.title,
                authors: book.authors,
            }
            context.response.status = 200;
        }
        else {
            context.response.body = { msg: "Book no encontrado" };
            context.response.status = 400;
        }
    }
    catch(error) {
        console.log(error);
        context.response.body = { msg: "Error" };
        context.response.status = 500;
    }
  });
  

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 7777 });

/*
.get("/book/:id", async (context) => {
    try {
        const params = getQuery(context, { mergeParams: true });

        if (!params.id) {
          context.response.status = 404;
          return;
        }
  
        const { id } = params;
        console.log(id)
        const response = await fetch(`https://gutendex.com/books/${id}`);
        const book: BookAPI = await response.json();

        if (book) {
            const { id, title, authors } = book;
            context.response.body = {
                id: id,
                title: title,
                authors: authors,
            }
            context.response.status = 200;
        }
        else {
            context.response.body = { msg: "Book no encontrado" };
            context.response.status = 400;
        }
  
        context.response.body = 
        context.response.status = 200;
    }
    catch(error) {
        console.log(error);
        context.response.body = { msg: "Error" };
        context.response.status = 500;
    }
  });
*/
