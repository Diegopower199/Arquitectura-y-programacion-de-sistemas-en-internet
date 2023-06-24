import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";

type PostAlgoContext = RouterContext<
  "/books",
  Record<string | number, string | undefined>,
  Record<string, any>
>;


export const postAlgo = async (context: PostAlgoContext) => {
  try {

  }

  catch(error) {
    console.log(error);
    context.response.status = 500;
  }
}