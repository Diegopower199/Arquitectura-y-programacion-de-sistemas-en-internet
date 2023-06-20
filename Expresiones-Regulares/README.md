# Expresiones regulares

## Expresión Regular Fecha dd/mm/yyyy
```
const expresionRegularFecha=/^(?:(?:(?:0?[1-9]|1\d|2[0-8])[/](?:0?[1-9]|1[0-2])|(?:29|30)[/](?:0?[13-9]|1[0-2])|31[/](?:0?[13578]|1[02]))[/](?:0{2,3}[1-9]|0{1,2}[1-9]\d|0?[1-9]\d{2}|[1-9]\d{3})|29[/]0?2[/](?:\d{1,2}(?:0[48]|[2468][048]|[13579][26])|(?:0?[48]|[13579][26]|[2468][048])00))$/;
 
const FechaValida="28/02/2021";//Cadena de Fecha dd/mm/yyyy
 
//Evaluación de Cadena Valida de Fecha dd/mm/yyyy
if(FechaValida.match(expresionRegularFecha) !== null) {
    console.log("Facha Válida");
}
else {
    console.log("Fecha Invalida");
}
```
