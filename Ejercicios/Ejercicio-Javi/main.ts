import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts"

type Author = {
    name: string
    birth_year?: number
    death_year?: number
};

type Book = {
    id: string
    title: string
    authors?: Author[]
};

/*type BookData = {
    booksResults: Book[]
}*/



type Api_Rest_Information = {
    count: number,
    next: string | null,
    previous: string | null,
    results: Book[]
}

const router = new Router()

router
    .get("/books", async(context) => {
        try {
            const booksData = await fetch("https://gutendex.com/books/?page=1")
            const booksJSON: Api_Rest_Information = await booksData.json()
            const books: Book[] = booksJSON.results;

            console.log(books)

            const allInformation = books.map ( ( book: Book) => ({
                title: book.title,
                id: book.id
            }))
            context.response.body = allInformation
            context.response.status = 200;
        } catch(e) {
            console.error(e)
            context.response.status = 500
            context.response.body = {
                error: e,
                message: "Internal Server Error"
            }
        }
    });

router.get("/hola", async (context) => {
    context.response.body = "aaaa";
})





const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())
await app.listen({port: 7777})