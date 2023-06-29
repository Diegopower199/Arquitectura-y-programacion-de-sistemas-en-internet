import { ObjectId } from "mongo";
import { PostSchema, UsuarioSchema } from "../db/schema.ts";
import { Post, Usuario, tipoUsuario } from "../types.ts";
import { UsuariosCollection } from "../db/dbconnection.ts";
import { createJWT, verifyJWT } from "../lib/jwt.ts";
import * as bcrypt from "bcrypt";

// No esta bien el createUser
export const Mutation = {
    createUser: async (_: unknown, args: { username: string, password: string, tipoUsuario: tipoUsuario }): Promise<UsuarioSchema> => {
        try {
            const { username, password, tipoUsuario } = args;
            const existsUsuario: UsuarioSchema | undefined = await UsuariosCollection.findOne({
              username: username,
            });
            if (existsUsuario) {
              throw new Error("User already exists");
            }
            const hashedPassword: string = await bcrypt.hash(password);
            
            if (tipoUsuario.toString() === "REGISTRADO_NORMAL") {
                const _id = await UsuariosCollection.insertOne({
                    username: username,
                    password: hashedPassword,
                    fechaCreacion: new Date(),
                    tipoUsuario: tipoUsuario,
                    postCreados: [],
                  });

                  return {
                    _id: _id,
                    username: username,
                    password: hashedPassword,
                    fechaCreacion: new Date(),
                    tipoUsuario: tipoUsuario,
                    postCreados: [],
                  }
            }
            else {
                const _id = await UsuariosCollection.insertOne({
                    username: username,
                    password: hashedPassword,
                    fechaCreacion: new Date(),
                    tipoUsuario: tipoUsuario,
                    postCreados: [],
                  });
                  return {
                    _id: _id,
                    username: username,
                    password: hashedPassword,
                    fechaCreacion: new Date(),
                    tipoUsuario: tipoUsuario,
                    postCreados: [],
                  }
            }
    
          } catch (e) {
            throw new Error(e);
          }
    },
    login: async (_: unknown, args: { username: string, password: string }): Promise<string> => {
        try {
            const { username, password } = args;
            const user: UsuarioSchema | undefined = await UsuariosCollection.findOne({
              username,
            });
            if (!user) {
              throw new Error("Invalid credentials");
            }
      
            let validPassword: boolean;

            if (user.password) {
                validPassword = await bcrypt.compare(password, user.password);
            }
            else {
                validPassword = false;
            }

            if (!validPassword) {
                throw new Error("Invalid credentials");
            }


              const token = await createJWT(
                {
                    id: user._id.toString(),
                    username: user.username,
                    fechaCreacion: user.fechaCreacion,
                    postCreados: user.postCreados.map( (post) => post.toString()),
                    tipoUsuario: user.tipoUsuario,
                },
                Deno.env.get("JWT_SECRET") || "",
            );
            
            return token;

          } catch (e) {
            throw new Error(e);
          }
    }
};


/*
deleteBook: async (_: unknown, args: { id: string }): Promise<BookSchema> => {
},

updateBooksMore2000: async (_: unknown, args: {}): Promise<number> => {
},
*/