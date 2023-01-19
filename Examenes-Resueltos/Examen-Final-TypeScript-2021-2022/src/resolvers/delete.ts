import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";


type Delete = RouterContext<
  "/books/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

type Delete1 = RouterContext<
  "/deleteUser", Record<string | number, string | undefined>,
  Record<string, any>
>;

export const nombreFuncion = async (context: Delete) => {
  
};
