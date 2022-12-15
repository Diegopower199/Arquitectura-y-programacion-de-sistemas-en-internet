import { getQuery } from "oak/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { BooksCollection, UserCollection } from "../db/dbconnection.ts";
import { AuthorSchema, BooksSchema, UserSchema } from "../db/schema.ts";

type GetBooksContext = RouterContext<
  "/getBooks",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetUserContext = RouterContext<
  "/getUser/:id",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getBooks = async (context: GetBooksContext) => {
  try {
    const page: number = parseInt(context.request.url.searchParams.get('page'));
    const title = context.request.url.searchParams.get('title');


    console.log(page)

    if (isNaN(page)) {
      context.response.status = 404;
      return;
    }
    

    if (page > - 1) {
      const pagina = await BooksCollection.find().skip(Number(page) * 10).limit(
        10,
      ).toArray();

      if (pagina) {
        if (title !== null) {
          /*const titulosEncontrados = await pagina.find((tituloEncontrado: BooksSchema,) => {
            console.log(tituloEncontrado._id);
            tituloEncontrado.title === title
          });*/
          const titulosEncontrados = await pagina.find((tituloEncontrado: BooksSchema,) => tituloEncontrado.title === title);
          
          if (titulosEncontrados) {
            context.response.body = titulosEncontrados;
            context.response.status = 200;
            return;
          } 
          else {
            context.response.body = "No existe ese libro en esa pagina";
            context.response.status = 404;
            return;
          }
        }
        else {
          console.log(typeof pagina)
          if (Object.entries(pagina).length === 0) {
            context.response.body = "No hay ningun dato en esta pagina";
            context.response.status = 200;
            return;
          }
          else {
            context.response.body = pagina;
            context.response.status = 200;
            return;
          }
        }
      } 
      
      else {
        context.response.body = "Error, no existe esa pagina";
        context.response.status = 405;
        return;
      }

      //context.response.body = pagina;
    } else {
      context.response.body = "Error, has introducido mal la url";
      context.response.status = 405;
      return;
    }
  } catch (error) {
    console.error(error);
    context.response.status = 500;
  }
};

export const getUser = async (context: GetUserContext) => {
  try {
    if (context.params?.id) {
      const user: UserSchema | undefined = await UserCollection.findOne({
        _id: new ObjectId(context.params.id),
      });
      if (user) {
        context.response.body = user;
        context.response.status = 200;
        return;
      } else {
        context.response.body = "No existe el usuario";
        context.response.status = 404;
        return;
      }
    }
  } catch (error) {
    console.log(error);
    context.response.status = 500;
  }
};
