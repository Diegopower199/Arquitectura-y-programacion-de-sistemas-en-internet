import { ObjectId } from "mongo";
import { RouterContext } from "oak/router.ts";
import { UserCollection } from "../db/mongo.ts";
import { UserSchema } from "../db/schemas.ts";
import { BooksCollection } from "../db/mongo.ts";
import { BooksSchema } from "../db/schemas.ts";

type UpdateCartContext = RouterContext<
  "/updateCart/:id_user/:id_book",
  {
    id_user: string;
    id_book: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const updateCart = async (context: UpdateCartContext) => {
  try {
    if (context.params?.id_user && context.params?.id_book) {
      const user: UserSchema | undefined = await UserCollection.findOne({
        _id: new ObjectId(context.params.id_user),
      });

      const book: BooksSchema | undefined = await BooksCollection.findOne({
        _id: new ObjectId(context.params.id_book),
      });

      if (user && book) {
        user.cart.push(book._id)
        await UserCollection.updateOne(
          {
            _id: user._id,
          },
          {
            $set: {
                cart: user.cart,
            },
          }
        )
        context.response.status = 200;
        return;
      } else {
        context.response.status = 404;
        context.response.body = { message: "user or book not found" };
      }
    }
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};