/**
 * @swagger
 * components:
 *  schemas:
 *    responseSingUp:
 *      type: object
 *      properties:
 *        redirect:
 *          type: string
 *          description: link redirige a la pagina de login
 *      example:
 *        redirect: /login
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    badRequestSingUp:
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *          description: indica el tipo de error que sucedio
 *      example:
 *        error: The user already exists!
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    responseLogin:
 *      type: object
 *      properties:
 *        redirect:
 *          type: string
 *          description: link de redireccion a la pagina account
 *      example:
 *        redirect: /account
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    badRequestLogin:
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *          description: indica el tipo de error que sucedio
 *      example:
 *        error: The username or password are incorrect!
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    dataSingUp:
 *      type: object
 *      required:
 *        - fullName
 *        - email
 *        - username
 *        - password
 *      properties:
 *        fullName:
 *          type: string
 *          description: nombre completo del usuario
 *        email:
 *          type: string
 *          description: correo electronico del usuario
 *        username:
 *          type: string
 *          description: nombre de usuario
 *        password:
 *          type: string
 *          description: contraseña del usuario
 *      example:
 *        fullname: Lucas Ruiz
 *        email: lucasruiz@gmail.com
 *        username: lucas_ruiz
 *        password: lucasrUIZ22
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    dataLogin:
 *      type: object
 *      required:
 *        - username
 *        - password
 *      properties:
 *        username: 
 *          type: string
 *          description: nombre de usuario
 *        password:
 *          type: string
 *          description: contraseña del usuario
 *      example:
 *        username: ana_reyes
 *        password: anareYes90
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    updateFullname:
 *      type: object
 *      required:
 *        - newFullname
 *      properties:
 *        newFullname:
 *          type: string
 *          description: nuevo nombre completo
 *      example:
 *        newFullname: Nuevo Nombre
 */


/**
 * @swagger
 * components:
 *  schemas:
 *    updateEmail:
 *      type: object
 *      required:
 *        - newEmail
 *      properties:
 *        newEmail:
 *          type: string
 *          description: nuevo correo electronico
 *      example:
 *        newEmail: nuevoemail@gmail.com
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    updateUsername:
 *      type: object
 *      required:
 *        - newUsername
 *      properties:
 *        newUsername:
 *          type: string
 *          description: nuevo nombre de usuario
 *      example:
 *        newUsername: nuevo_nombre_de_usuario
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    updatePassword: 
 *      type: object
 *      required:
 *        - newPassword
 *      properties:
 *        newPassword:
 *          type: string
 *          description: nueva contraseña
 *      example:
 *        newPassword: contrseña123
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    badRequestFullname:
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *          description: indica el tipo de error
 *      example:
 *        error: Failed to update full name, please try again later!
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    badRequestEmail:
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *          description: indica el tipo de error
 *      example:
 *        error: The new email cannot be the same as your current email!
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    badRequestUsername:
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *          description: indica el tipo de error
 *      example:
 *        error: The new username cannot be the same as your current username!
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    badRequestPassword:
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *          description: indica el tipo de error
 *      example:
 *        error: Failed to update password, please try again later!
 */


/**
 * @swagger
 * components:  
 *  schemas:
 *    purchaseOrder:
 *      type: object
 *      required:
 *        - idPurchase
 *        - total
 *        - idUser
 *      properties:
 *        idPurchase:
 *          type: string
 *          description: id de la orden de compra
 *        total:
 *          type: decimal
 *          description: total de la compra
 *        idUser:
 *          type: integer
 *          description: id del usuario/cliente
 *      example:
 *        idPurchase: $
 *        total: 08:00
 *        idUser: 1
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    purchaseDetails:
 *      type: object
 *      required:
 *        - idPurchase
 *        - idTicket
 *        - amount
 *        - subtotal
 *      properties:
 *        idPurchaseOrder:
 *          type: string
 *          description: id de la orden de compra
 *        idTicket:
 *          type: integer
 *          description: id del ticket comprado
 *        amount:
 *          type: integer
 *          description: cantida del ticket comprado
 *        subtotal:
 *          type: decimal
 *          description: subtotal de la compra
 *      example:
 *        idPurchase: $
 *        idTicket: 2
 *        amount: 3
 *        subtotal: 24.00
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    AllCustomerPurchase:
 *      type: object
 *      required:
 *        - date_purchase
 *        - title
 *        - poster
 *        - subtitle
 *        - type_format
 *        - total
 *        - amount_ticket
 *      properties:
 *        date_purchase:
 *          type: string
 *          description: fecha de la orden de compa
 *        title: 
 *          type: string
 *          description: titulo de la pelicula
 *        poster:
 *          type: string
 *          description: ruta de la imagen del poster de la pelicula
 *        subtitle:
 *          type: integer
 *          description: indica si la pelicula tiene subtitulos
 *        type_format:
 *          type: string
 *          description: tipo del formato de la pelicula
 *        total: 
 *          type: decimal
 *          description: total de la compra
 *        amount_ticket:
 *          type: integer
 *          description: cantida de tickets comprados
 *      example:
 *        date_purchase: 29/12/2024, 22:00:00
 *        title: John Wick 4
 *        poster: john_wick-4.jpg
 *        subtitle: 0
 *        type_format: 3D
 *        total: 24.00
 *        amount_ticket: 3
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    purchaseCreated:
 *      type: object
 *      required:
 *        - date_purchase
 *        - title
 *        - date_ticket
 *        - type_format
 *        - subtitles
 *        - ticket_price
 *        - subtotal
 *        - total
 *        - fullname
 *        - id_purchase_order
 *        - poster
 *        - amount_ticket
 *      properties:
 *        date_purchase:
 *          type: string
 *          description: fecha de la orden de compra
 *        title:
 *          type: string
 *          description: titulo de la pelicula
 *        date_ticket:
 *          type: string
 *          description: fecha y hora de la funcion
 *        type_format:
 *          type: string
 *          description: tipo de fromtao de la pelicula
 *        subtitles:
 *          type: integer
 *          description: indica si la pelicula esta subtitulda
 *        ticket_price:
 *          type: decimal
 *          description: precio unitario
 *        subtotal:
 *          type: decimal
 *          description: subtotal de la orden de compra
 *        total:
 *          type: decimal
 *          description: toal final de la orden de compra
 *        fullname:
 *          type: string
 *          description: nombre completo del usuario
 *        id_purchase_order:
 *          type: string
 *          description: id dfe la orden de compra
 *        poster:
 *          type: string
 *          description: ruta de la imgaen del poster
 *        amount_ticket:
 *          type: amount
 *          description: cantida de tickets comprados
 *      example:
 *        date_purchase: 29/12/2024, 22:13:00
 *        title: John Wick 4
 *        date_ticket: 05/01/2025, 21:00:00
 *        type_format: 3D
 *        subtitles: 0
 *        ticket_price: 08.00
 *        subtotal: 24.00
 *        total: 24.00
 *        fullname: Lucas Ruiz
 *        id_purchase_order: $
 *        poster: john_wick-4.jpg
 *        amount_ticket: 3
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    userProfile:
 *      type: object
 *      required:
 *        - fullname
 *        - email
 *        - username
 *      properties:
 *        fullname:
 *          type: string
 *          description: nombre completo del usuario
 *        email:
 *          type: string
 *          description: correo electronico del usuario
 *        username:
 *          type: string
 *          description: nombre de usuario
 *      example:
 *        fullname: Lucas Ruiz
 *        email: lucasruiz@gmail.com
 *        username: lucasruiZ57
 */ 

/**
 * @swagger
 * components:
 *  schemas:
 *    movieCatalog:
 *      type: object
 *      required:
 *        - id_movie
 *        - title
 *        - poster
 *      properties:
 *        id_movie:
 *          type: integer
 *          description: id de la pelicula
 *        title:
 *          type: string
 *          description: titulo de la pelicula
 *        poster:
 *          type: string
 *          description: ruta del archivo del poster de la pelicula
 *      example:
 *        id_movie: 1
 *        title: John Wick 4
 *        poster: john_wick-4.jpg
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    movieData:
 *      type: object
 *      required:
 *        - id_movie
 *        - title
 *        - description 
 *        - duration_time
 *        - poster
 *        - trailer
 *        - type
 *      properties:
 *        id_movie:
 *          type: integer
 *          description: id de la pelicula
 *        title:
 *          type: string
 *          description: titulo de la pelicula
 *        description:
 *          type: string
 *          description: descripcion y breve resumen de la pelicula
 *        duration_time:
 *          type: string
 *          description: tiempo de duracion de la pelicula
 *        poster:
 *          type: string
 *          description: ruta del archivo del poster de la pelicula
 *        trailer:
 *          type: srting
 *          description: video del trailer de la pelicula
 *        type:
 *          type: string
 *          description: tipo de clasificacion de la pelicula
 *      example:
 *        id_movie: 1
 *        title: John Wick 4
 *        description: With the price on his head ever increasing ...
 *        duration_time: 2h 49m
 *        poster: john_wick-4.jpg
 *        trailer: <iframe width="560" height="315" src=...</iframe>
 *        type: R
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    ticketsData:
 *      type: object
 *      required:
 *        - id_ticket
 *        - type_fromat
 *        - date_ticket
 *        - subtitles
 *        - stock
 *        - ticket_price
 *        - title
 *        - hall_name
 *      properties:
 *        id_ticket:
 *          type: integer
 *          description: id del ticket
 *        type_fromat:
 *          type: string
 *          description: tipo de formato de la pelicula
 *        date_ticket:
 *          type: string
 *          description: fecha y hora de la funcion
 *        subtitles:
 *          type: integer
 *          description: indica si la pelicula esta subtitulada
 *        stock:
 *          type: integer
 *          description: cantidad disponibles de tickets
 *        ticket_price:
 *          type: integer
 *          description: precio unitario del ticket
 *        title:
 *          type: string
 *          description: titulo de la pelicula 
 *        hall_name:
 *          type: string
 *          description: nombre de la sala para ver la funcion
 *      example:
 *        id_ticket: 1
 *        type_fromat: 3D
 *        date_ticket: 22/11/2024, 22:00:00
 *        subtitles: 0
 *        stock: 100
 *        ticket_price: 08.00 
 *        title: John Wick 4
 *        hall_name: H A1
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    badRequestPurchaseOrder:
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *          description: indica el tipo de error
 *      example: 
 *        error: Duplicate entry!
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    badRequestPurchaseDetails:
 *      type: obejct
 *      properties:
 *        error:
 *          type: string
 *          description: indica el tipo de error
 *      example: error!
 */

/**
 * @swagger
 * components:
 *  schemas:  
 *    paymentSession:
 *      type: object
 *      required:
 *        - total
 *        - movie
 *        - amount
 *      properties:
 *        total:
 *          type: decimal
 *          description: total a pagar
 *        movie:
 *          type: string
 *          description: titulo de la pelicula
 *        amount:
 *          type: integer
 *          description: cantidad de tickets a comprar
 *      example:
 *        total: 24:00
 *        movie: John Wick 4
 *        amount: 3
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    urlSuccess:
 *      type: object
 *      properties:
 *        url:
 *          type: string
 *          description: url para realizar pagos a travez del servicio de stripe
 *      example:
 *        url: https://localhost:3000/success_payment
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    stockTickets:
 *      type: object
 *      required:
 *        - idTicket
 *        - amount
 *      properties:
 *        idTicket:
 *          type: integer
 *          description: id del ticket seleccionado
 *        amount:
 *          type: integer
 *          description: cantida de tickets seleccionados
 *      example:
 *        idTicket: 19
 *        amount: 2
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    responseStockTickets:
 *      type: object
 *      properties:
 *        code:
 *          type: string
 *          description: codigo de la orden de compra a crear
 *      example:
 *        code: $
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    badRequestStockTickets:
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *          description: indica el tipo de error 
 *      example:
 *        error: empty!
 */

// USER ROUTES

/**
 * @swagger
 * /home/account/profile:
 *    get:
 *      tags:
 *        - user
 *      summary: retorna una lista con informacion del perfila del usuario
 *      responses:
 *        200:
 *          description: lista de un objetos con informacion del usuario
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/userProfile'
 *        503:
 *          description: ocurrio un error temporal en la base de datos
 */

/**
 * @swagger
 * /home/account/user_purchase:
 *  get:
 *    tags:
 *      - user
 *    summary: retorna informacion de todas las ordenes de compras
 *    responses:
 *      200:
 *        description: lista de objeto con de todas la ordenes de compras
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/AllCustomerPurchase'
 *      503:
 *        description: ocurrio un error temporal en la base de datos
 */

/**
 * @swagger
 * /home/movie_page/success_payment/data_purchase/code:code:
 *  get:
 *    tags:
 *      - user
 *    summary: retorna informacion de una orden de compra realizada
 *    responses:
 *      200:
 *        description: lista de objeto con infomacion de la orden de compra
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/purchaseCreated'
 *      503:
 *        description: ocurrio un error temporal en la base de datos
 */

/**
 * @swagger
 * /login/user:
 *  post:
 *    summary: inicio de secion del usuario
 *    tags:
 *      - user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/dataLogin'
 *    responses:
 *      200:
 *        description: inicio de secion exitoso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/responseLogin'
 *      400:
 *        description: erro al iniciar sesion
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/badRequestLogin'
 *      503:
 *        description: ocurrio un error temporal en la base de datos
 */

/**
 * @swagger
 * /singup/user:
 *  post:
 *    summary: crea un nuevo usuario
 *    tags:
 *      - user
 *    requestBody:
 *      required: true
 *      content:  
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/dataSingUp'
 *    responses:
 *      200:
 *        description: se registro un nuevo usario exitosamente
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/responseSingUp'
 *      400:
 *        description: ocurrio un error al registra un nuevo usario
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/badRequestSingUp'
 *      503:
 *        description: ocurrio un error temporal en la base de datos 
 */

/**
 * @swagger
 * /home/account/profile/update_fullname:
 *  put:
 *    summary: actualiza el nobre completo del usuario
 *    tags:
 *      - user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/updateFullname'
 *    responses:
 *      201:
 *        description: se actualizo el nombre exitosamente
 *      400:
 *        description: ocurrio un error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/badRequestFullname'
 *      503:
 *        description: ocurrio un error temporal en la base de datos
 */

/**
 * @swagger
 * /home/account/profile/update_email:
 *  put:
 *    summary: actualiza el correo electronico de usuarioñ
 *    tags:
 *      - user
 *    requestBody:  
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/updateEmail'
 *    responses:  
 *      201:
 *        description: se actualizo el email exitosamente
 *      400:
 *        description: ocurrio un error
 *        content:
 *          application/json:
 *            schema: 
 *              $ref: '#/components/schemas/badRequestEmail'
 *      503:
 *        description: ocurrio un error temporal en la base de datos
 */

/**
 * @swagger
 * /home/account/profile/update_username:
 *  put:
 *    summary: actualiza el nombre de usuario
 *    tags:
 *      - user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/updateUsername'
 *    responses:
 *      201:
 *        description: se actualizo el nombre de usuario exitosamente
 *      400:
 *        description: ocurrio un error
 *        content:
 *          appliction/json:
 *            schema:
 *              $ref: '#/components/schemas/badRequestUsername'
 *      503:
 *        description: ocurrio un error temporal en la base de datos
 */

/**
 * @swagger
 * /home/account/profile/update_password:
 *  put:
 *    summary: actualiza la contraseña del usuario
 *    tags:
 *      - user
 *    requestBody:
 *      required: true  
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/updatePassword'
 *    responses:
 *      201:
 *        description: se actualizo la contreña exitosamente
 *      400:
 *        description: ocurrio un error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/badRequestPassword'
 *      503:
 *        description: ocurrio un error temporal en la base de datos
 */


/**
 * @swagger
 * /home/account/profile/delete_account:
 *  delete:
 *    summary: elimina la cuenta del usuario
 *    tags:
 *      - user  
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/updatePassword'
 *    responses:
 *      204:
 *        description: se elimino la cuenta exitosamente
 *      400:
 *        description: ocurrio un error
 *      503:
 *        description: ocurrio un error temporal en la base de datos
 *      
 */

// CINEMARK ROUTES  

/**
 * @swagger
 * /home/premiers:
 *    get:
 *      tags:
 *        - movies
 *      summary: retorna una lista con peliculas de la categoria premier
 *      responses:
 *        200:
 *          description: lista de objetos con informacion de cada pelicula
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items: 
 *                  $ref: '#/components/schemas/movieCatalog'
 *        503:
 *          description: ocurrio un error temporal en la base de datos
 */

/**
 * @swagger
 * /home/movie_page/movie/id{id}:
 *  get:
 *    tags:
 *      - movies
 *    summary: retorna informacion de una pelicula seleccionada
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: id de la pelicula en la base de datos
 *    responses:
 *      200:
 *        descriptions: lista con un objeto con la informacion
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/movieData'
 *      503:
 *        description: ocurrio un error temporal en la base de datos
 */

/**
 * @swagger
 * /home/movie_page/ticket/id:{id}:
 *  get:
 *    tags:
 *      - movies
 *    summary: retorna una lista con el objeto con informacion del ticket
 *    parameters:
 *      - in: path  
 *        name: id
 *        schema:
 *          type:
 *            integer
 *          required: true
 *          description: id del ticket en la base de datos
 *    responses:
 *      200:
 *        descriptions: lista con un objeto con informacion
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ticketsData'
 *      503:
 *        description: ocurrio un error temporal en la base de datos
 */

/**
 * @swagger
 * /home/movie_page/success_payment/new_purchase:
 *  post:
 *    summary: crea una nueva orden de compra
 *    tags:
 *      - movies
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/purchaseOrder'
 *    responses:
 *      204:
 *        description: se creo una nueva orden de compra exitosamente
 *      400:
 *        description: ocurrio un error
 *      503:
 *        description: ocurrio un error temporal en la base de datos
 */

/**
 * @swagger
 * /home/movie_page/success_payment/new_purchase_details:
 *  post:
 *    summary: crea un detalle de la orden de compra
 *    tags:
 *      - movies
 *    requestBody:
 *      requied: true
 *      content:
 *        application/josn:
 *          schema:
 *            $ref: '#/components/schemas/purchaseDetails'
 *    responses:
 *      204:
 *        description: se creo un detalle de la orden de compra exitosamente
 *      400:
 *        description: ocurrio un error
 *      503:
 *        description: ocurrio un error temporal en la base de datos
 */

/**
 * @swagger
 * /home/movie_page/payments:
 *  post:
 *    summary: crea una sesion en stripe
 *    tags:
 *      - payments
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/paymentSession'
 *    responses:
 *      200:
 *        description: url de la pasarela de pagos
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/urlSuccess'
 *      400:
 *        description: ocurrio un error!
 */

/**
 * @swagger
 * /home/movie_page/reserve_tickets:
 *  put:
 *    summary: crea una reserva de los tickets y actualiza el stock en la base de datos
 *    tags:
 *      - movies
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/stockTickets'
 *    responses:
 *      201:
 *        description: se creo una reserva exitosamente
 *        conetent:
 *          application/json:
 *          schema:
 *            $ref: '#/components/schemas/responseStockTickets'
 *      400:
 *        description: ocurrio un error!
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/badRequestStockTickets'
 *      503:
 *        description: ocurrio un error temporal en la base de datos
 */

/**
 * @swagger
 * /home/movie_page/restore_tickets:
 *  put:
 *    summary: restaura el stock al cancelar la compra
 *    tags:
 *      - movies
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/stockTickets'
 *    responses:
 *      201:
 *        description: se restauro el stock exitosamente
 *        conetent:
 *          application/json:
 *          schema:
 *            $ref: '#/components/schemas/responseStockTickets'
 *      400:
 *        description: ocurrio un error!
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/badRequestStockTickets'
 *      503:
 *        description: ocurrio un error temporal en la base de datos
 */