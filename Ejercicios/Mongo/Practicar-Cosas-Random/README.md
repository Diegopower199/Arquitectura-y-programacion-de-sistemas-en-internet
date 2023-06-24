Recuperacion del año pasado back-end 

# Todo esto es graphql pero lo vamos a hacer para API Rest

Voy a añadir varios querys y mutation

Querys: 

 - Mostrar por pantalla varios libros por su id: **booksWithId (ids: [ID!]!): [Book!]! ✔** 

 - Mostrar por pantalla varios autores por su id: **authorsWithId (ids: [ID!]!): [Author!]! ✔**
    
 - Mostrar por pantalla varias editoriales por su id: **pressHousesWithId (ids: [ID!]!): [PressHouse!]! ✔**


Mutation: 

  - Actualizar los datos
        
    - Actualizar name (es opcional), la web y el country de Press House: **updatePressHouse (idPressHouse: ID!,name: String, web: String!, country: String!): PressHouse!**

    - Actualizar los books y quedarse con los libros que tengan del 2000 hacia adelante: **updateBooksMore2000: Int!**

    - Actualizar el titulo de un book: **updateTitleBook (title: String!, titleNew: String!): Book!**

    - Actualizar el author de un book por otro author y ademas se debera actualizar el array de books del tipo Author: **updateAuthorOfTheBook (authorDelete: ID!, authorAdd: ID!, title: String!): Book!**

    
  - Borrar los datos

    - Borrar libros que el titulo empiezen con "El": **deleteBook (principioTitulo: String!): Book!**

    - Borrar libros que esten entre dos fechas posibles (ejemplo -> desde el año: 1990 hasta el año: 1996): **deleteBook (primeraFecha: Int!, segundaFecha: Int!): Book!**

    - Borrar authors que tengan libros (esos libros deben aparecer en la variable authors que es nulo): **deleteAuthors(author: ID!): Author!** (No hay mucha logica aqui, pero es para practicar)


Funcionalidad extra

Hacer un usuario que tengala siguiente informacion:

  - User
      - Name
      - Surname
      - Dni
      - Birth date
      - Fecha Creacion
      - tipoUsuario
      - Username
      - Password
      - Token
      - Autores que sigue
      - Libros que tiene
      - Libros que le gustaria tener
  
Hacemos una enumeracion (Enum) para que tengamos tipos de usuario y podamos implementar mas funciones
  - Tipo de usuario
    - REGISTRADO = "REGISTRADO"
    - MODO_INVITADO = "MODO INVITADO"


Querys

  - Mostrar toda la informacion de un usuario: **getUser(userId: ID!): User!**

  - Mostrar toda la informacion de todos los usuarios: **getUsers(usersId: [ID!]!): [User!]!**

  - Mostrar la informacion de todos los usuarios que tengan una fecha de creacion de 2022 hacia adelante: **getUsers2022: [User!]!**usersId

  - Mostrar los autores que sigue: **getUserWhoFollowAuthors: [Author!]!**

  - Mostrar los libros que tiene: **getUserHasBook: [Book!]!**

  - Mostrar los libros que le gustaria tener: **getUserWouldLikeToHaveBook: [Book!]!**


Mutation:

  - Añadir usuario
        
      - Añadir un usuario: **createUser(username, password): User!**


  - Actualizar informacion usuario

      - Modificar el name y surname (opcional) y cambiar contraseña: ****

      - Modificar los libros que le gustaria: ****


  - Borrar informacion usuario

      - Borrar autores que sigue: ****

      - Borrar usuario: ****

      - Borrar libros que le gustaria: ****