import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { AuthorsCollection, BooksCollection, PressHousesCollection } from "../db/dbconnection.ts";
import { AuthorSchema, BookSchema, PressHouseSchema } from "../db/schema.ts";

type PostPressHouseContext = RouterContext<
  "/addPressHouse",
  Record<string | number, string | undefined>,
  Record<string, any>
>;


export const postPressHouse = async (context: PostPressHouseContext) => {
  try {
   const params = context.request.body({ type: "json" });
   const value = await params.value;

   const { name, web, country, books } = value;
   const pressHouseEncontrar: PressHouseSchema | undefined = await PressHousesCollection.findOne({
    name: name,
    web: web,
   });

   if (pressHouseEncontrar) {
    context.response.body = { msg: "Ya existe la press house" };
    context.response.status = 400;
    return;
   }

   const addPressHouse: ObjectId = await PressHousesCollection.insertOne({
    name: name,
    web: web,
    country: country,
    books: books,
   });

   context.response.body = {
    _id: addPressHouse,
    name: name,
    web: web,
    country: country,
    books: books,
   };
   context.response.status = 200;
  } 
  catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};

type PostAuthorContext = RouterContext<
  "/addAuthor",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postAuthor = async (context: PostAuthorContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;

    const { name, lang, books } = value;
    const authorEncontrar: AuthorSchema | undefined = await AuthorsCollection.findOne({
      name: name,
    });
    
    if (authorEncontrar) {
      context.response.body = { msg: "Ese author ya existe" };
      context.response.status = 400;
      return;
    }

    const addAuthor: ObjectId = await AuthorsCollection.insertOne({
      name: name,
      lang: lang,
      books: books,
    });

    context.response.body = {
      _id: addAuthor,
      name: name,
      lang: lang,
      books: books,
    }
  } 
  catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};


type PostBookContext = RouterContext<
  "/addBook",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postBook = async (context: PostBookContext) => {
  try {
   const params = context.request.body({ type: "json" });
   const value = await params.value;

   const { title, author, pressHouse, year } = value;

   const bookEncontrado: BookSchema | undefined = await BooksCollection.findOne({
    title: title,
   });

   if (bookEncontrado) {
    context.response.body = { msg: "Ese libro ya existe" };
    context.response.status = 400;
    return;
   }

   const authorEncontrar: AuthorSchema | undefined = await AuthorsCollection.findOne({
    _id: new ObjectId(author),
   })

   if (!authorEncontrar) {
    context.response.body = { msg: "No existe la id del author introducido"};
    context.response.status = 400;
    return;
   }

   const pressHouseEncontrar: PressHouseSchema | undefined = await PressHousesCollection.findOne({
    _id: new ObjectId(pressHouse),
   });
   
   if (!pressHouseEncontrar) {
    context.response.body = { msg: "No existe la id del press house introducido" };
    context.response.status = 400;
    return;
   }

   const addBook: ObjectId = await BooksCollection.insertOne({
    title: title,
    author: author,
    pressHouse: pressHouse,
    year: year,
   });

   context.response.body = {
    _id: addBook,
    title: title,
    author: author,
    pressHouse: pressHouse,
    year: year, 
   }
   context.response.status = 200;

  } 
  catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};