import { getQuery } from "oak/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { ObjectId } from "mongo";
import { AuthorsCollection, BooksCollection, PressHousesCollection } from "../db/dbconnection.ts";
import { AuthorSchema, BookSchema, PressHouseSchema } from "../db/schema.ts";

type GetBooksContext = RouterContext<
  "/books",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getBooks = async (context: GetBooksContext) => {
  try {
    const books: BookSchema[] = await BooksCollection.find({}).toArray();

    context.response.body = books;
    context.response.status = 200;
  } 
  catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};

type GetAuthorsContext = RouterContext<
  "/authors",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getAuthors = async (context: GetAuthorsContext) => {
  try {
    const authors: AuthorSchema[] = await AuthorsCollection.find({}).toArray(); 

    context.response.body = authors;
    context.response.status = 200;
  } 
  catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};

type GetPressHousesContext = RouterContext<
  "/presshouses",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getPressHouses = async (context: GetPressHousesContext) => {
  try {
    const pressHouses: PressHouseSchema[] = await PressHousesCollection.find({}).toArray(); 

    const pressHousesPromesas = pressHouses.map( async (pressHouse) => {
      const pressHouseBook: BookSchema[] | undefined = await BooksCollection.find({books: pressHouse.books}).toArray();
    })

    context.response.body = pressHouses;
    context.response.status = 200;
  } 
  catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};

type GetBookWithIDContext = RouterContext<
  "/book/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getBooksWithId = async (context: GetBookWithIDContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });
    if (!params.id) {
      context.response.body = { msg: "Nos falta el parametro de id" };
      context.response.status = 400;
      return;
    }

    const { id } = params;

    const bookEncontrar: BookSchema | undefined = await BooksCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!bookEncontrar) {
      context.response.body = { msg: "El libro con esa id no encontrada" };
      context.response.status = 400;
      return;
    }

    context.response.body = {
      id: bookEncontrar._id,
      title: bookEncontrar.title,
      author: bookEncontrar.author,
      pressHouse: bookEncontrar.pressHouse,
      year: bookEncontrar.year,
    }
    context.response.status = 200;
  } 
  catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};

type GetAuthorWithIDContext = RouterContext<
  "/author/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getAuthorWithId = async (context: GetAuthorWithIDContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });
    if (!params.id) {
      context.response.body = { msg: "Nos falta el parametro de id" };
      context.response.status = 400;
      return;
    }

    const { id } = params;

    const authorEncontrar: AuthorSchema | undefined = await AuthorsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!authorEncontrar) {
      context.response.body = { msg: "El author con esa id no encontrada" };
      context.response.status = 400;
      return;
    }

    context.response.body = {
      id: authorEncontrar._id,
      name: authorEncontrar.name,
      lang: authorEncontrar.lang,
      books: authorEncontrar.books,
    }
    context.response.status = 200;
  } 
  catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};

type GetPressHouseWithIDContext = RouterContext<
  "/presshouse/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getPressHouseWithId = async (context: GetPressHouseWithIDContext) => {
  try {
    const params = getQuery(context, { mergeParams: true });
    if (!params.id) {
      context.response.body = { msg: "Nos falta el parametro de id" };
      context.response.status = 400;
      return;
    }

    const { id } = params;

    const pressHouseEncontrar: PressHouseSchema | undefined = await PressHousesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!pressHouseEncontrar) {
      context.response.body = { msg: "El press house con esa id no encontrada" };
      context.response.status = 400;
      return;
    }

    context.response.body = {
      id: pressHouseEncontrar._id,
      name: pressHouseEncontrar.name,
      web: pressHouseEncontrar.web,
      country: pressHouseEncontrar.country,
      books: pressHouseEncontrar.books,
    }
    context.response.status = 200;
  } 
  catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};
