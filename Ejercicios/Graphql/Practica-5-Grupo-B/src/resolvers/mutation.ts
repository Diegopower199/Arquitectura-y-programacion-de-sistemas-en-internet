import { MensajesCollection, UsuarioCollection } from "../db/dbconnection.ts";
import { MensajeSchema } from "../db/schema.ts"
import { UsuarioSchema } from "../db/schema.ts";
import * as bcrypt from "bcrypt";
import { createJWT, verifyJWT } from "../lib/jwt.ts";
import { Context, Usuario } from "../types.ts";
import { ObjectId } from "mongo";



export const Mutation = {
    createUser: async (_: unknown, args: {username: string, password: string }, ctx: Context): Promise<UsuarioSchema> => {
        try {
            const { username, password } = args;
            const usuarioEncontrado: UsuarioSchema | undefined = await UsuarioCollection.findOne({
                username: username
            });

            if (usuarioEncontrado) {
                throw new Error("Error, ya hay un usuario con ese username");
            }

            const passwordEncriptada = await bcrypt.hash(password);

            const fecha = new Date();
            const idioma: string = ctx.lang || "es";

            const addUsuario: ObjectId = await UsuarioCollection.insertOne({
                username: username,
                password: passwordEncriptada,
                fechaCreacion: fecha,
                idioma: idioma
            });

            return {
                _id: addUsuario,
                username: username,
                password: passwordEncriptada,
                fechaCreacion: fecha,
                idioma: idioma,
            }
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

            if (userEncontrado.password) {
                validPassword = await bcrypt.compare(password, userEncontrado.password);
            }
            else {
                validPassword = false;
            }

            if (!validPassword) {
                throw new Error("La contraseña no coincide");
            }

            const token = await createJWT(
                {
                    id: userEncontrado._id.toString(),
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
    
    sendMessage: async (_: unknown, args: { destinatario: string, menssage: string }, ctx: Context): Promise<MensajeSchema> => {
        try {
            const { destinatario, menssage } = args;

            if (ctx.lang === null) {
                throw new Error("En los headers debes añadir el lang");
            }
            if (ctx.token === null) {
                throw new Error("En los headers debes añadir el token")
            }

            const payload = await verifyJWT(
                ctx.token || "",
                Deno.env.get("JWT_SECRET")!,
            );

            const usuarioEmisor: Usuario = payload as Usuario;

            const encontrarUsuarioEmisor: UsuarioSchema | undefined = await UsuarioCollection.findOne({
                _id: new ObjectId(usuarioEmisor.id),
            });

            if (!encontrarUsuarioEmisor) {
                throw new Error("Ese usuario no existe con ese token");
            }
            
            if (ctx.lang !== encontrarUsuarioEmisor.idioma) {
                throw new Error("Error, el idioma no es el mismo en el Auth que el emisor");
            }

            const encontrarUsuarioDestinatario: UsuarioSchema | undefined = await UsuarioCollection.findOne({
                _id: new ObjectId(destinatario),
            });

            if (!encontrarUsuarioDestinatario) {
                throw new Error("Ese usuario no existe con esa id");
            }

            const fechaCreacion = new Date();

            const crearMessage: ObjectId = await MensajesCollection.insertOne({
                emisor: encontrarUsuarioEmisor._id,
                receptor: encontrarUsuarioDestinatario._id,
                idioma: ctx.lang,
                fechaCreacionMensaje: fechaCreacion,
                contenido: menssage,
            });

            return {
                _id: crearMessage,
                emisor: encontrarUsuarioEmisor._id,
                receptor: encontrarUsuarioDestinatario._id,
                idioma: ctx.lang,
                fechaCreacionMensaje: fechaCreacion,
                contenido: menssage,
            }
        }
        catch(error) {
            throw new Error(error);
        }
    }
};


/*
ejemplo: async (_: unknown, args: {}): Promise<Tipo1> => {
}
*/
