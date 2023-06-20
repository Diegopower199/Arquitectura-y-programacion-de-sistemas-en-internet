import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";


type PutUpdate = RouterContext<
  "/funcionPut",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const nombreFuncion = async (context: PutUpdate) => {
  try {

  }

  catch(error) {
    console.log(error);
    context.response.status = 500;
  }
}