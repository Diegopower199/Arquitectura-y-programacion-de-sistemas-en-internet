
FAN XU Y CARLOS BERMUDEZ

Ejemplos para el postman:

-addUser-
URL --> localhost:7777/addUser
Body:
{
  "name": "Fan",
  "email": "fan@alumnos.nebrija.es",
  "password": 14323
}

-addAuthor-
URL --> localhost:7777/addAuthor
Body:
{
  "name": "Carlos"
}

-addBook-
URL --> localhost:7777/addBook/638cd25cecc75af14d2c0675
Body:
{
  "title": "Don Quijote",
  "author": "Cervantes",
  "pages": 123
}
Nota: el /:id es el id del autor del libro que ha escrito el libro que queremos crear.

-deleteUser-
URL --> localhost:7777/deleteUser?_id=638ca87bffe14e27a34fbd73
Nota: el id es el id que se ha guardado en mongo --> nosotros hemos utilizado el que se ha generado
a nosotros, es posible que tengas que cambiar el valor del id del URL.

-updateCart-
URL --> localhost:7777/updateCart/638cb37e04c90acb3c84b0f8/638caa0bffe14e27a34fbd75
Nota: .../updateCart/primerid que es el id del usuario /segundo id que es el id del libro

-getBooks-
URL1 --> localhost:7777/getBooks
URL2 --> localhost:7777/getBooks?page=1
URL3 --> localhost:7777/getBooks?page=1&title=Margarita
Nota: para que salga más books necesitas introducir más valores en el body de addBook.

-getUser-
URL --> localhost:7777/getUser/638cb37e04c90acb3c84b0f8
Nota: el id es el id que se ha guardado en mongo --> nosotros hemos utilizado el que se ha generado
a nosotros, es posible que tengas que cambiar el valor del id del URL.