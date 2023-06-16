Recuperacion del año pasado back-end 

Voy a añadir varios querys y mutation

Querys: 

 - Mostrar por pantalla varios libros por su id: **booksWithId (ids: [ID!]!): [Book!]!**

 - Mostrar por pantalla varios autores por su id: **authorsWithId (ids: [ID!]!): [Author!]!**
    
 - Mostrar por pantalla varias editoriales por su id: **pressHousesWithId (ids: [ID!]!): [PressHouse!]!**


Mutation: 

  - Actualizar los datos
        
    - Actualizar name (es opcional), la web y el country de Press House: **updatePressHouse (name: String, web: String!, country: String!): PressHouse!**

    - Actualizar los books y quedarse con los libros que tengan del 2000 hacia adelante: **updateBooksMore2000: Book!**

    - Actualizar el titulo de un book: **updateTitleBook (title: String!): Book!**

    - Actualizar el author de un book y ademas se debera actualizar el array de books del tipo Author: **updateAuthorOfTheBook (author: ID!): Book!**

    
  - Borrar los datos

    - Borrar libros que el titulo empiezen con "El": **deleteBook (principioTitulo: String!): Book!**

    - Borrar libros que esten entre dos fechas posibles (ejemplo -> desde el año: 1990 hasta el año: 1996): **deleteBook (primeraFecha: Int!, segundaFecha: Int!): Book!**

    - Borrar authores que tengan libros (esos libros deben aparecer en la variable authors que es nulo): **a** 


Funcionalidad extra

Hacer un usuario que tengala siguiente informacion:

  - User
      - Name
      - Surname
      - Dni
      - Birth date
      - Username
      - Password
      - Token
      - Autores que sigue
      - Libros que tiene
      - Libros que le gustaria tener


Querys

  - Mostrar toda la informacion de un usuario: ****

  - Mostrar los autores que sigue: ****

  - Mostrar los libros que tiene: ****

  - Mostrar los libros que le gustaria tener: ****


Mutation:

  - Añadir usuario
        
      - Añadir un usuario: ****


  - Actualizar informacion usuario

      - Modificar el name y surname (opcional) y cambiar contraseña: ****

      - Modificar los libros que le gustaria: ****


  - Borrar informacion usuario

      - Borrar autores que sigue: ****

      - Borrar usuario: ****

      - Borrar libros que le gustaria: ****

    

