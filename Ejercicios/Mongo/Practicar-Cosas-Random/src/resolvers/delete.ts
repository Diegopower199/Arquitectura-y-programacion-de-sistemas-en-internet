import { getQuery } from "oak/helpers.ts";
import { Database, ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";


type DeleteAlgoConIdContext = RouterContext<"/books/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

type DeleteAlgoContext = RouterContext<
  "/deleteUser", Record<string | number, string | undefined>,
  Record<string, any>
>;

export const deleteAlgoConID = async (context: DeleteAlgoConIdContext) => {
  try {

  }

  catch(error) {
    console.log(error);
    context.response.status = 500;
  }
};

export const deleteAlgoSinID = async (context: DeleteAlgoContext) => {
  try {
    
  }

  catch(error) {
    console.log(error);
    context.response.status = 500;
  }
};
