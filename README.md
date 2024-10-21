# Cinemark aplicacion web
Este software soluciona la organizacion y descongestion al momento de comprar entradas de manera presencial, simplificacndo este proceso, dando la posibilidad de que el usuario pueda acceder al amplio catalogo de películas en sus diferentes formatos, con información acerca de las entradas como las fechas y horarios disponibles, de esta manera podra comprar las entradas que necesite a travez de la aplicación web. Al crear una cuenta, el usuario puede gestionar su información como tanbien, puede acceder a su historial de compras realizadas, simplemente ingresando a la aplicación web  desde su telefono computadora u otros dispositvos.
EL proyecto esta contruido basandose en el patron de diseño (MVC).
## Tabla de contenido
1. [Características](#características)
3. [BackEnd](#backEnd)
4. [Base de datos](#base-de-datos)
5. [Documentacion](#documentacion)
6. [Pruebas unitarias](#pruebas-unitarias)
7. [Monitoreo de rutas](#monitoreo-de-rutas)
2. [FrontEnd](#frontend)
## Características
- Gestión de usuarios implementacion de tokens de autorizacion y autenticacion
- Integración con API de terceros, utiliza los servicios de stripe para realizar pagos online
- Implementacion de varibles de entorno para el acceso a diferentes ervicios y otros usos especificos
- Optimizacion de APIs mediante utlizacion de cache y limitando la cantidad de peticiones
## BackEnd
- Tecnologias utilizadas: TypeScript Node.js con Express
```
backend/
│
├── source/            # carpeta donde se encuentra el codigo fuente
|   ├── config/        # configuracion y conexion a la base de datos
│   ├── controllers/   # procesan las peticiones y logica de las respuestas
|   ├── docs/          # archivos de configuracion de swagger y documentacion de los endpoints
|   ├── middlewares/   # inspeccionan los datos de transaccion en los endpoints
|   ├── models/        # conexion, configuracion y modelos de datos y consultas
|   ├── monitoring/    # procesamintos y preparacion de los archivos de logs
|   ├── routes/        # define las rutas y se especifica qué controlador debe manejar la petición
|   ├── testing/       # archivos de testing (pruebas unitarias) para el asegurar el correcto funcionamiento de la aplicacion
|   └── index/         # punto de entrada de la aplicacion (configuracion del servidor)
```
## Base de datos
La informacion esta almacenada en una base de datos relacional, utiliza la libreria de sequelize para definir los medelos, conexion e interaccion con la base de datos a travez de un ORM, esta diseñada y graficada con la herramienta [dbdiagram.io](https://dbdiagram.io/)
- Base de datos relacional
- Modelos y consultas utilizando ORM
- Gestor de base de datos: MySql
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
- Tecnologias utilizadas: HTML5 CSS3 JavaScript
```
frontend/
|── app/
|   ├── public/    #archivos estaticos (estilos, scripts, imagenes)
|   ├── source/
|       └── views/ # archivos de vistas
```
## Inicio
- Inicio de la aplicacion: una vez clonado el repositorio se debe escribir el siguiente comando en la terminal
```bash
npm start
```
## Instalacion
- Dependencias: para instalar las dependencias necesarias para el correcto funcionamineto de la applicacion, ejecuta el siguiente comando en la terminal
```bash
npm install
```
