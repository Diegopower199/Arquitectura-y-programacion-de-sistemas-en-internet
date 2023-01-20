import { ObjectId } from "mongo";
import { AuthorsCollection, BooksCollection, PressHouseCollection } from "../db/dbconnection.ts";
import { AuthorSchema, BookSchema, PressHouseSchema } from "../db/schema.ts";

export const Mutation = {
    addPressHouse: async (_: unknown, args: { name: string, web: string, country: string, books: string[]}, ): Promise<PressHouseSchema> => {
        try {
            const pressHouseExiste = await PressHouseCollection.findOne({
                name: args.name,
            });

            if (pressHouseExiste){
                throw new Error("YA EXISTE EL PRESS HOUSE");
            }

            const pressHouse: ObjectId = await PressHouseCollection.insertOne({
              name: args.name,
              web: args.web,
              country: args.country,
              books: args.books.map( (book) => new ObjectId(book)),
             
            });
      
            return {
                _id: pressHouse,
                name: args.name,
                web: args.web,
                country: args.country,
                books: args.books.map( (book) => new ObjectId(book)),
            };
        }
        catch(e) {
            throw new Error(e);
        }
    },

    addAuthor: async (_: unknown, args: { name: string, lang: string, books: string[] }, ): Promise<AuthorSchema> => {
        try {
            const authorExiste = await AuthorsCollection.findOne({
                name: args.name,
            });

            if (authorExiste){
                throw new Error("YA EXISTE EL author");
            }

            const author: ObjectId = await AuthorsCollection.insertOne({
                name: args.name,
                lang: args.lang,
                books: args.books.map( (book) => new ObjectId(book)),
            });

            return {
                _id: author,
                name: args.name,
                lang: args.lang,
                books: args.books.map( (book) => new ObjectId(book)),
            }
        }


        catch (e) {
            throw new Error(e);
        }
    },

    addBook: async (_: unknown, args: { title: string, author: string, pressHouse: string, year: number }, ): Promise<BookSchema> => {
        try {
            const bookExiste = await BooksCollection.findOne({
                title: args.title
            });

            if (bookExiste){
                throw new Error("YA EXISTE EL book");
            }

            const book: ObjectId = await BooksCollection.insertOne({
                title: args.title,
                author: new ObjectId(args.author),
                pressHouse: new ObjectId(args.pressHouse),
                year: args.year,

            });

            return {
                _id: book,
                title: args.title,
                author: new ObjectId(args.author),
                pressHouse: new ObjectId(args.pressHouse),
                year: args.year
            }
        }

        catch(e) {
            throw new Error(e)
        }
    },

    deletePressHouse: async (_: unknown, args: { id: string }): Promise<PressHouseSchema> => {
        const pressHouseExiste: PressHouseSchema | undefined = await PressHouseCollection.findOne({
            _id: new ObjectId(args.id),
          })
    
          if (!pressHouseExiste) {
            throw new Error("Press house not found");
          }
    
    
          const deletedPressHouse = await PressHouseCollection.deleteOne({
            _id: new ObjectId(args.id),
          });

          return {
            _id: pressHouseExiste._id,
            name: pressHouseExiste.name,
            web: pressHouseExiste.web,
            country: pressHouseExiste.country,
            books: pressHouseExiste.books.map( (book) => new ObjectId(book)),
          }
    },

    deleteAuthor: async (_: unknown, args: { id: string }): Promise<AuthorSchema> => {
        const authorExiste: AuthorSchema | undefined = await AuthorsCollection.findOne({
            _id: new ObjectId(args.id),
          })
    
          if (!authorExiste) {
            throw new Error("Author not found");
          }
    
    
          const deletedAuthor = await AuthorsCollection.deleteOne({
            _id: new ObjectId(args.id),
          });

          return {
            _id: authorExiste._id,
            name: authorExiste.name,
            lang: authorExiste.lang,
            books: authorExiste.books.map( (book) => new ObjectId(book)),
          }
    },

    deleteBook: async (_: unknown, args: { id: string }): Promise<BookSchema> => {
        const bookExiste: BookSchema | undefined = await BooksCollection.findOne({
            _id: new ObjectId(args.id),
          })
    
          if (!bookExiste) {
            throw new Error("Author not found");
          }
    
    
          const deletedBook = await BooksCollection.deleteOne({
            _id: new ObjectId(args.id),
          });

          return {
            _id: bookExiste._id,
            title: bookExiste.title,
            author: bookExiste.author,
            pressHouse: bookExiste.pressHouse,
            year: bookExiste.year,
          }
    }

};