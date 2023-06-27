import { UsuarioCollection } from "../db/dbconnection.ts";
import { MensajeSchema } from "../db/schema.ts"
import { UsuarioSchema } from "../db/schema.ts";
import * as bcrypt from "bcrypt";
import { createJWT, verifyJWT } from "../lib/jwt.ts";



export const Mutation = {
    createUser: async (_: unknown, args: {username: string, password: string }): Promise<UsuarioSchema> => {
        try {
            
        }
        catch(error) {
            throw new Error(error);
        }
    },
    login: async (_: unknown, args: { username: string, password: string }): Promise<string> => {
        try {
            const { username, password } = args;
            const userEncontrado: UsuarioSchema | undefined = await UsuarioCollection.findOne({
                username: username,
            });

            if (!userEncontrado) {
                throw new Error("El username no existe")
            }

            let validPassword: boolean;

            validPassword = await bcrypt.compare(password, userEncontrado.password);

            if (!validPassword) {
                throw new Error("La contraseña no coincide");
            }

            const token = await createJWT(
                {
                    _id: userEncontrado._id.toString(),
                    username: userEncontrado.username,
                    fechaCreacion: userEncontrado.fechaCreacion,
                    idioma: userEncontrado.idioma,
                },
                Deno.env.get("JWT_SECRET")!,
            );

            return token;
        }
        catch(error) {
            throw new Error(error);
        }
    },
    
    sendMessage: async (_: unknown, args: { destinatario: string, menssage: string }): Promise<MensajeSchema> => {

    }
};


/*
ejemplo: async (_: unknown, args: {}): Promise<Tipo1> => {
}
*/

createUser(username: String!, password: String!): Usuario!
  login(username: String!, password: String!): String!
  deleteUser: Usuario!
  sendMessage(destinatario: String!, menssage: String!): Mensaje!