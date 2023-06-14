import { ObjectId } from "mongo";
import { AuthorCollection, BookCollection, PressHouseCollection } from "../db/dbconnection.ts";
import { BookSchema } from "../db/schema.ts";
import { AuthorSchema } from "../db/schema.ts";
import { PressHouseSchema } from "../db/schema.ts";


export const Mutation = {
    addPressHouse: async  (_: unknown, args: {name: string, web: string, country: string, books: string[]}): Promise<PressHouseSchema> => {
        try {
            const {name, web, country, books} = args;

            const pressHouseEncontrada: PressHouseSchema | undefined = await PressHouseCollection.findOne({
                name: name,
            });

            if (pressHouseEncontrada) {
                throw new Error("Ya tenemos esa informacion en una press House");
            }

            // Encontrar si existe todos los libros PORQUE SI NO TIENE QUE MOSTRAR UN ERROR
            const booksEncontrados: BookSchema[] = await BookCollection.find({}).toArray();
            const idsCollection: string[] = booksEncontrados.map( (book) => book._id.toString());

            books.forEach( (book) => {
                if (!idsCollection.includes(book)) {
                  throw new Error(`El libro "${book}" no se encuentra en la colección`);
                }
            });
              
    

            const pressHouseCreate: ObjectId = await PressHouseCollection.insertOne({
                name: name,
                web: web,
                country: country,
                books: books.map( (book) => new ObjectId(book)),
            })
            
            return {
                _id: pressHouseCreate,
                name: name,
                web: web,
                country: country,
                books: books.map( (book) => new ObjectId(book)),
            }
        }
        catch (e) {
            throw new Error(e);
        }
    },
    addAuthor: async (_: unknown, args: {name: string, lang: string, books: string[]}): Promise <AuthorSchema> => {
        try {
            const {name, lang, books} = args;
            const authorEncontrado: AuthorSchema | undefined = await AuthorCollection.findOne({
                name: name,
            });

            if (authorEncontrado) {
                throw new Error ("Author existente");
            }

            // Encontrar si existe todos los libros PORQUE SI NO TIENE QUE MOSTRAR UN ERROR
           
            const booksEncontrados: BookSchema[] = await BookCollection.find({}).toArray();
            const idsCollection: string[] = booksEncontrados.map( (book) => book._id.toString());

            books.forEach( (book) => {
                if (!idsCollection.includes(book)) {
                  throw new Error(`El libro "${book}" no se encuentra en la colección`);
                }
            });

            const authorCreate: ObjectId = await AuthorCollection.insertOne({
                name: name,
                lang: lang,
                books: books.map( (book) => new ObjectId(book)),
            })

            return {
                _id: authorCreate,
                name: name,
                lang: lang,
                books: books.map( (book) => new ObjectId(book)),
            }
        }
        catch (e) {
            throw new Error(e);
        }
    },
    addBook: async (_: unknown, args: {title: string, author: string, pressHouse: string, year: number}): Promise<BookSchema> => {
        try {
            const {title, author, pressHouse, year} = args;
            const bookEncontrado: BookSchema | undefined = await BookCollection.findOne({
                title: title,
            });

            if (bookEncontrado) {
                throw new Error ("Book existente");
            }

            const authorEncontrado: AuthorSchema | undefined = await AuthorCollection.findOne({
                _id: new ObjectId(author),
            })

            if (!authorEncontrado) {
                throw new Error ("No existe ese id de author");
            }

            const pressHouseEncontrado: PressHouseSchema | undefined = await PressHouseCollection.findOne({
                _id: new ObjectId(pressHouse),
            });

            if (!pressHouseEncontrado) {
                throw new Error ("No existe ese id de Press House")
            }

            
            const bookCreate: ObjectId = await BookCollection.insertOne({
                title: title,
                author: new ObjectId(author),
                pressHouse: new ObjectId(pressHouse),
                year: year,
            })

            return {
                _id: bookCreate,
                title: title,
                author: new ObjectId(author),
                pressHouse: new ObjectId(pressHouse),
                year: year,
            }
        }
        catch (e) {
            throw new Error(e);
        }
    },
    deletePressHouse: async(_: unknown, args: {id: string}): Promise<PressHouseSchema> => {
        try {
            const {id} = args;
            const pressHouseEncontrada: PressHouseSchema | undefined = await PressHouseCollection.findOne({
                _id: new ObjectId(id),
            });

            if (!pressHouseEncontrada) {
                throw new Error("No tenemos ese id de press House");
            }

            const pressHouseDelete = await PressHouseCollection.deleteOne({
                _id: new ObjectId(id),
            });

            return {
                _id: pressHouseEncontrada._id,
                name: pressHouseEncontrada.name,
                web: pressHouseEncontrada.web,
                country: pressHouseEncontrada.country,
                books: pressHouseEncontrada.books.map( (book) => new ObjectId(book)),
            }
        }
        catch (e) {
            throw new Error(e);
        }
    },
    deleteAuthor: async(_: unknown, args: {id: string}): Promise<AuthorSchema> => {
        try {
            const {id} = args;
            const authorEncontrada: AuthorSchema | undefined = await AuthorCollection.findOne({
                _id: new ObjectId(id),
            });

            if (!authorEncontrada) {
                throw new Error("No tenemos ese id de un author");
            }

            const authorDelete = await AuthorCollection.deleteOne({
                _id: new ObjectId(id),
            });

            return {
                _id: authorEncontrada._id,
                name: authorEncontrada.name,
                lang: authorEncontrada.lang,
                books: authorEncontrada.books.map( (book) => new ObjectId(book)),
                
            }
        }
        catch (e) {
            throw new Error(e);
        }
    },
    deleteBook: async(_: unknown, args: {id: string}): Promise<BookSchema> => {
        try {
            const {id} = args;
            const bookEncontrada: BookSchema | undefined = await BookCollection.findOne({
                _id: new ObjectId(id),
            });

            if (!bookEncontrada) {
                throw new Error("No tenemos ese id de un libro");
            }

            const bookDelete = await BookCollection.deleteOne({
                _id: new ObjectId(id),
            });

            return {
                _id: bookEncontrada._id,
                title: bookEncontrada.title,
                author: bookEncontrada.author,
                pressHouse: bookEncontrada.pressHouse,
                year: bookEncontrada.year,
               
            }
        }
        catch (e) {
            throw new Error(e);
        }
    },

};