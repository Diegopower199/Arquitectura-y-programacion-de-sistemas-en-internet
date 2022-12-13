import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { RouterContext } from "oak/router.ts";
import {AuthorsCollection, BooksCollection, UserCollection,} from "../db/dbconnection.ts";
import { AuthorSchema, BooksSchema, UserSchema } from "../db/schema.ts";
import { Author, Books, User } from "../types.ts";

type DeleteUserContext = RouterContext<
  "/deleteUser", Record<string | number, string | undefined>,
  Record<string, any>
>;

export const deleteUser = async (context: DeleteUserContext) => {
    try {
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (typeof value.id !== "string") {
          context.response.body = "Error, el id no tiene un formato correcto, debe ser string";
          context.response.status = 404;
          return;
        }
        const {_id} = {
          _id: value.id
        }
        if (_id) {
            const count = await UserCollection.deleteOne({
              _id: new ObjectId(_id),
            });

            if (count) {
                context.response.body =  `"Usuario eliminado con este id" ${_id}"`;
                context.response.status = 200;
                return;
            } 
            else {
                //console.log("NO se ha econtrado el usuario")
                context.response.body = "NO se ha encontrado el usuario";
                context.response.status = 404;
                return;
              
            }
        }
        
    }

    catch(error) {
        console.error(error);
    context.response.status = 500;
    }
};