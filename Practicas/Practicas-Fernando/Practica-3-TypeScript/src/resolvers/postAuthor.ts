import { RouterContext } from "oak/router.ts";
import { AuthorSchema } from "../db/schemas.ts";
import { Author } from "../types.ts";
import { AuthorCollection } from "../db/mongo.ts";

type PostAddAuthorContext = RouterContext<
  "/addAuthor",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postAuthors = async (context: PostAddAuthorContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;
    if (!value?.name) {
      context.response.status = 400;
      return;
    }
    const author: Partial<Author> = {
      name: value.name,
      books: [],
    };

    await AuthorCollection.insertOne(author as AuthorSchema);
    const { _id, ...authorWithoutId } = author as AuthorSchema;
    context.response.body = authorWithoutId;
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};
