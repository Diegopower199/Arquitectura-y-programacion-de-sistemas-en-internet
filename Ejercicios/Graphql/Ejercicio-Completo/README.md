Recuperacion del año pasado back-end 

Voy a añadir varios querys y mutation

Querys: 

    - Mostrar por pantalla varios libros por su id: booksWithId (ids: [ID!]!): [Book!]!

    - Mostrar por pantalla varios autores por su id: authorsWithId (ids: [ID!]!): [Author!]!
    
    - Mostrar por pantalla varias editoriales por su id: pressHousesWithId (ids: [ID!]!): [PressHouse!]!


Mutation: 

    - Actualizar los datos
        
        - Actualizar name (es opcional), la web y el country de Press House 

        - Actualizar los books y quedarse con los libros que tengan del 2000 hacia adelante

        - Actualizar el titulo de un book

        - Actualizar el author de un book y ademas se debera actualizar el array de books del tipo Author

        - Borrar libros que empiezen con "El"

        - Borrar libros que esten entre dos fechas posibles (ejemplo -> desde el año: 1990 hasta el año: 1996)


