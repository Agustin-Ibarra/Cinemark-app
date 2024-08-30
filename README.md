# Cinemark aplicacion web
Este software, fue creado para permitir al usuario ver el catalago de peliculas que ofrece Cinemark en sus diferentes formatos, como tambien, permitir comprar entradas de la pelicula, desde su telefono computadora u otros dispositvos, de esta forma evitara tener que hacerlo de forma presencial dentro de los horarios de atencion.
De este modo el usurio puede acceder a este servicio en cualquier lugar y momento.
EL proyecto esta contruido basandose en la qruitectura (MVC).
## Tabla de contenido
1. [Características](#características)
3. [BackEnd](#backEnd)
4. [Base de datos](#base-de-datos)
5. [Documentacion](#documentacion)
6. [Pruebas unitarias](#pruebas-unitarias)
7. [Monitoreo de rutas](#monitoreo-de-rutas)
2. [FrontEnd](#frontEnd)
## Características
- Gestión de usuarios implementacion de tokens de autorizacion y autenticacion
- Integración con API de terceros, utiliza los servicios de stripe para realizar pagos online
- implementacion de varibles de entorno para el acceso a diferentes ervicios y otros usos especificos
## BackEnd
- Tecnologias utilizadas: TypeScript Node.js con Express
```
backend/
│
├── source/            # carpeta donde se encuentra el codigo fuente
|   ├── config/        # configuracion y conexion a la base de datos
│   ├── controllers/   # Controladores de las rutas
|   ├── docs/          # archivos de configuracion de swagger y documentacion de los endpoints
|   ├── middlewares/   # inspeccionan los datos de transaccion en los endpoints
|   ├── models/        # coneccion configuracion y modelos de datos y sus consultas
|   ├── monitoring/    # procesamintos y preparacion de los archivos de logs
|   ├── routes/        # definicion de la funciones  que procesan las peticiones
|   ├── testing/       # archivos de testing (pruebas unitarias) de la aplicacion
|   └── index/         # archivo indice (configuracion del servidor)
```
## Base de datos
La informacion esta almacebada en una base de datos relacional, utiliza la libreria de sequelize para definir los medelos, conexion e interaccion con la base de datos a travez de un ORM, esta diseñada y graficada con la herramienta [dbdiagram.io](https://dbdiagram.io/)
- Base de datos relacional
- Modelos y consultas utilizando ORM
- Getstor de base de datos: MySql
## Documentacion
- Documentacion de APIs: la documentacion de los endpoint y APIs fue creada con Swagger Open.io
- Documentacion del codigo fuente: la documentacion del codigo fuente fue creada con JSDoc
- Enlace: documentacion disponible en [docs](http://localhost:3001/cinemark/documentation)
## Pruebas unitarias
- Librerias: las pruebas unitarias estan creadas con las librerias de Jest y supertest
- Iniciar test: con el siguiente comando ejecuta las pruebas unitarias
```bash
npm test
```
## Monitoreo de rutas
- Monitoreo: se realiza con la libreria morgan, node-cron y nodemailer, se implementa node-cron para ejecutar scripts, estos scripts, realizan procesaminto de los archivos en un horario de poca actividad en el servidor, una vez procesados los datos, son enviados en un formato de archivo csv como notificacion a travez de un mail, posteriormente son analizados para resolver errores ocurridos durante el ciclo de funcionamiento del sistema
## FrontEnd
- Tecnologias utilizadas: html5 CSS3 JavaScript
```
frontend/
|── app/
|   ├── public/    #archivos staticos (stilos, scripts, imagenes)
|   ├── source/
|       └── views/ # archivos de vistas
```
## Inicio
- Inicio de la plicacion: una vez clonado el repositorio se debe escribir el siguiente comando en la terminal
```bash
npm start
```
## Instalacion
- Dependencias: para instalar las dependencias para el correcto funcionamineto de la applicacion, ejecuta el siguiente comando en la terminal
```bash
npm install
```
