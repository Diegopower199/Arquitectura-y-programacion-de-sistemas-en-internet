import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { arrayUsuarios } from "../types.ts"

type DeleteUserContext = RouterContext<"/deleteUser/:id", {
    id: string;
// deno-lint-ignore no-explicit-any
} & Record<string | number, string | undefined>, Record<string, any>>;

export const deleteUser = (context: DeleteUserContext) => {
    try {
        if (
            context.params?.id &&
            arrayUsuarios.find((usuario) => usuario.ID === Number(context.params.id))
        ) {
            arrayUsuarios.splice(
                arrayUsuarios.findIndex(
                    (usuario) => usuario.ID === Number(context.params.id),
                ),
                1,
            );
            context.response.body = "Usuario eliminado";
            context.response.status = 200;
            return;
        }
    
        context.response.body = "Usuario no encontrado";
        context.response.status = 404;
    }
    catch (e) {
        context.response.status = 500;
        conext.response.body = e;
    }
};