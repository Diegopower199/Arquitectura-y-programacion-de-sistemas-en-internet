import { getQuery } from "oak/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { ObjectId } from "mongo";

type GetAlgoContext = RouterContext<
  "/books",
  Record<string | number, string | undefined>,
  Record<string, any>
>;


export const getAlgo = async (context: GetAlgoContext) => {
  try {

  }

  catch(error) {
    console.log(error);
    context.response.status = 500;
  }
}