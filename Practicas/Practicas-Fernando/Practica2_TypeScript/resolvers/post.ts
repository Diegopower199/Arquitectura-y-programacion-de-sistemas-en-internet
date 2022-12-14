import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { arrayUsuarios, Users } from "../types.ts";

let contadorParaIDIBAN = arrayUsuarios.length + 1;
let ibanModelo = "ES0000000000000000000000";

type AddUserContext = RouterContext<"/addUser",
    // deno-lint-ignore no-explicit-any
    Record<string | number, string | undefined>, Record<string, any>
>;

type AddTransactionContext = RouterContext<"/addTransaction",
    // deno-lint-ignore no-explicit-any
    Record<string | number, string | undefined>, Record<string, any>
>;


export const addUser = async (context: AddUserContext) => {
    const listaDeErrores: string[] = [];
    try {
        const result = context.request.body({ type: "json" });
        const value = await result.value;

        console.log("Valor ID: ", value.ID, "   ", (typeof value.ID !== "undefined"), "------");

        if (!value?.Email || !value?.Nombre || !value?.Apellidos || !value?.Telefono || !value?.DNI) {
            context.response.status = 400;
            context.response.body = "Faltan datos!";
            return;
        }

        // cambiar posiblemente por un hash
        else if (arrayUsuarios.find((usuario) => usuario.ID === value.ID || usuario.DNI === value.DNI || usuario.Email === value.Email || usuario.IBAN === value.IBAN || usuario.Telefono === value.Telefono)) {
            context.response.status = 400;
            context.response.body = "El usuario ya existe!";
            return;
        }

        else {
            // Comprobacion de que es correcto el DNI
            if (typeof value.DNI !== "string") {
                listaDeErrores.push("Error, el DNI no tiene un formato correcto, debe ser string");
            }
            else if (value.DNI.length === 9) {
                try {
                    value.DNI.split("").forEach((letras: string, posicion: number) => {
                        console.log(letras, "   ", posicion, "               ", posicion === 8 && (letras.charCodeAt(0) >= 65 || letras.charCodeAt(0) <= 90))
                        if (posicion !== 8 && (letras.charCodeAt(0) >= 48 && letras.charCodeAt(0) <= 57)) {
                            //console.log("Son numeros");
                        }
                        else if (posicion === 8 && (letras.charCodeAt(0) >= 65 && letras.charCodeAt(0) <= 90)) {
                            console.log("Hola", posicion === 8 && (letras.charCodeAt(0) >= 65 || letras.charCodeAt(0) <= 90));
                        }
                        else {
                            throw "Error, usted no ha seguido la estructura de DNI";
                        }
                    });
                }
                catch (error) {
                    listaDeErrores.push(error);

                    //console.log(error);
                }
            }
            else {
                listaDeErrores.push("Error, el tamaño del DNI no es el correcto, debe ser 8 primeros numeros y el ultimo una letra en mayúscula")
            }

            // Comprobacion que el nombre es de tipo string
            if (typeof value.Nombre !== "string") {
                listaDeErrores.push("Error, el nombre no tiene un formato correcto, debe ser string");
            }

            // Comprobacion que los apellidos es de tipo string
            if (typeof value.Apellidos !== "string") {
                listaDeErrores.push("Error, el apellido no tiene un formato correcto, debe ser string");
            }


            // Comprobacion de que es correcto el Telefono
            if (typeof value.Telefono !== "string") {
                listaDeErrores.push("Error, el telefono no tiene un formato correcto, debe ser string");
            }
            else if (value.Telefono.length === 9) {

                try {
                    value.Telefono.split('').forEach((letras: string) => {
                        //console.log(letras, "   ", posicion)
                        if (letras.charCodeAt(0) >= 48 && letras.charCodeAt(0) <= 57) {
                            //console.log("Son numeros");
                        }
                        else {
                            throw "Error, usted no ha seguido la estructura de telefono";
                        }
                    });
                }

                catch (error) {
                    listaDeErrores.push(error);
                    //console.log("ERROR, USTED NO HA SEGUIDO UNA ESTRUCTURA DEL TELEFONO");
                }
            }

            else {
                listaDeErrores.push("Error, el tamaño del Telefono no es el correcto, debe ser 9 digitos");
                //console.log("EL TAMAÑO NO ES VALIDO");
            }

            // Comprobacion del email
            if (typeof value.Email !== "string") {
                listaDeErrores.push("Error, el email no tiene un formato correcto, debe ser string");
            }

            else if (!value.Email.includes("@gmail.com" || "@outlook.es" || "@hotmail.com")) {
                listaDeErrores.push("Error, no hay direccion de correo valida, debe ser '@gmail.com', '@outlook.es' o '@hotmail.com'");

            }

            // Comprobar que el usuario no haya introducido un ID ni un IBAN

            if (typeof value.ID !== "undefined") {
                listaDeErrores.push("Error, usted no puede introducir un ID");
            }
            else {
                console.log("NO ESTOY DENTRO")
            }

            if (typeof value.IBAN !== "undefined") {
                listaDeErrores.push("Error, usted no puede introducir un IBAN");
            }

            // comprobamos de que el balance es correcto
            if (typeof value.Balance !== "number") {
                listaDeErrores.push("Error, el balance no tiene un formato correcto, debe ser number");
            } else if (value.Balance < 0) {
                listaDeErrores.push("Error, el balance no puede ser negativo");
            }

            if (listaDeErrores.length != 0) {
                context.response.body = listaDeErrores;
                context.response.status = 500;
                return;
            }


            ibanModelo = ibanModelo.substring(0, ibanModelo.length - (contadorParaIDIBAN.toString().length)) + contadorParaIDIBAN;
            // verificar si el id es valido
            const usuarioNuevo: Users = {
                DNI: value.DNI, // unico
                Nombre: value.Nombre,
                Apellidos: value.Apellidos,
                Telefono: value.Telefono, // unico
                Email: value.Email, // unico
                IBAN: ibanModelo, // unico
                Balance: value.Balance,
                ID: contadorParaIDIBAN,
            };
            contadorParaIDIBAN++;
            arrayUsuarios.push(usuarioNuevo);
            context.response.status = 201;
            context.response.body = "Usuario creado";

        }

    }
    catch (error) {
        context.response.status = 500;
        context.response.body = error;
    }
}
export const addTransaction = async (context: AddTransactionContext) => {
    const listaDeErrores: string[] = [];

    try {
        const result = context.request.body({ type: "json" });
        const value = await result.value;

        if (!value?.ID_Sender || !value?.ID_Receiver || !value?.Amount) {
            context.response.status = 400;
            context.response.body = "Faltan datos!";
            return;
        }


        if (typeof value.ID_Sender !== "number") {
            console.log("aaaaaaaaaaaaaaaaaaa")
            listaDeErrores.push("Error, el id sender no tiene un formato correcto, debe ser number")
        }

        if (typeof value.ID_Receiver !== "number") {
            listaDeErrores.push("Error, el id receiver no tiene un formato correcto, debe ser number");
        }

        if (typeof value.Amount !== "number") {
            listaDeErrores.push("Error, el balance no tiene un formato correcto, debe ser number");
        }

        console.log(listaDeErrores.length);

        if (listaDeErrores.length != 0) {
            context.response.body = listaDeErrores;
            context.response.status = 500;
            return;
        }

        else {
            const usuarioSender: Users | undefined = arrayUsuarios.find(
                (usuario) => usuario.ID === value.ID_Sender
            );
            const usuarioReceiver: Users | undefined = arrayUsuarios.find(
                (usuario) => usuario.ID === value.ID_Receiver
            );

            if (!usuarioSender || !usuarioReceiver) {
                context.response.status = 404;
                context.response.body = "No se ha encontrado el usuario!";
                return;
            }

            if (value.Amount < 0) {
                context.response.status = 400;
                context.response.body = "La cantidad debe ser mayor que 0";
                return;
            }

            if (value.ID_Sender === value.ID_Receiver) {
                context.response.status = 400;
                context.response.body = "No puedes transferirte dinero a ti mismo!";
                return;
            }

            if (usuarioSender.Balance < value.Amount) {
                context.response.status = 400;
                context.response.body = "No tienes suficiente dinero!";
                return;
            }

            usuarioSender.Balance -= value.Amount;
            usuarioReceiver.Balance += value.Amount;

            context.response.status = 200;
            context.response.body = `Transaccion realizada con exito! ${usuarioSender.Nombre} ha transferido ${value.Amount}€ a ${usuarioReceiver.Nombre}`;
        }
    }

    catch (error) {
        context.response.status = 500;
        context.response.body = error;
    }

};