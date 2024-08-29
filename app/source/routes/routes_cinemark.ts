import { Request, Response } from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import { v4 } from 'uuid';
import dotenv from 'dotenv';
import { getPayload } from '../routes/routes_user.js';
import { Clasification, Format, Movie } from '../models/movies_models.js';
import { Op } from 'sequelize';
import { Ticket } from '../models/tickets_models.js';
import { Sequelize } from 'sequelize-typescript';
import { PurchaseDetails, PurchaseOrder } from '../models/purchase_models.js';
import { User } from '../models/users_models.js';

dotenv.config();
const __dirname  = path.dirname(fileURLToPath(import.meta.url));

export const getHome = function(req:Request,res:Response){
  res.sendFile(path.join(__dirname,'../../source/views/cinemark_UI/home.html'));
}

// envia una lista con informcacion de peliculas de la categoria premier
export const getPremiersMovies = async function(req:Request,res:Response){
  Movie.findAll({
    where:{
      premier:1
    },
    attributes:['id_movie','title','poster']
  })
  .then((result)=>{
    res.send(result);
  })
  .catch((error)=>{
    console.log(error);
  })
}

// envia informacion de las peliculas del fromato 3D
export const get3DMovies = function(req:Request,res:Response){
  Movie.findAll({
    where:{
      [Op.or]:[
        {format:2},
        {format:4}
      ]
    },
    attributes:['id_movie','title','poster']
  })
  .then((result)=>{
    res.send(result);
  })
  .catch((error)=>{
    console.log(error);
  });
}

// envia informacion de las peliculas del fromato 2D
export const get2DMovies = function(req:Request,res:Response){
  Movie.findAll({
    where:{
      [Op.or]:[
        {format:1},
        {format:4}
      ]
    },
    attributes:['id_movie','title','poster']
  })
  .then((result)=>{
    res.send(result);
  })
  .catch((error)=>{
    console.log(error)
  });
}

export const getMoviePage = function(req:Request,res:Response){
  res.sendFile(path.join(__dirname,'../../source/views/cinemark_UI/movie.html'));
}

// obtiene informacion de una pelicula y la envia en la respuesta
export const getMovieInfo = function(req:Request,res:Response){
  const id:Number = Number(req.params.id.replace(':',''));
  Movie.findAll({
    include:[{
      model:Clasification,
      as:'clasifications',
      attributes:['type']
    }],
    where:{
      id_movie:id
    },
    attributes:['title','id_movie','poster','description','duration_time','trailer']
  })
  .then((result)=>{
    res.send(result)
  })
  .catch((error)=>{
    console.log(error)
  })
}

// obtiene informacion de los ticekets de una pelicula y los envia en la respuesta
export const getMovieTicketData = function(req:Request,res:Response){
  const idMovie:Number = Number(req.params.id.replace(':',''));
  Ticket.findAll({
    include:[
    {
      model:Format,
      as:'formats',
      attributes:['type_format']
    },
    {
      model:Movie,
      as:'movies',
      attributes:['title']
    }
  ],
    where:{
      movie:idMovie,
    },
    attributes:['id_ticket','date_ticket','subtitles','stock','ticket_price']
  })
  .then((result)=>{
    res.send(result)
  })
  .catch((error)=>{
    console.log(error);
  })
}

// envia informacion de los tickets de las peliculas de formato 2D
export const getMovieTicketDataFromat2D = function(req:Request,res:Response){
  const idMovie:Number = Number(req.params.id.replace(':',''));
  Ticket.findAll({
    include:[
      {
        model:Format,
        as:'formats',
        attributes:['type_format']
      },
    ],
    where:{
      movie:idMovie,
      ticket_format:1
    },
    attributes:['id_ticket','date_ticket','subtitles','stock','ticket_price']
  })
  .then((result)=>{
    res.send(result)
  })
  .catch((error)=>{
    console.log(error);
  })
}

// envia informacion de los tickets de las peliculas de formato 3D
export const getMovieTicketDataFromat3D = function(req:Request,res:Response){
  const idMovie:Number = Number(req.params.id.replace(':',''));
  Ticket.findAll({
    include:[
      {
        model:Format,
        as:'formats',
        attributes:['type_format']
      },
    ],
    where:{
      movie:idMovie,
      ticket_format:2
    },
    attributes:['id_ticket','date_ticket','subtitles','stock','ticket_price']
  })
  .then((result)=>{
    res.send(result)
  })
  .catch((error)=>{
    console.log(error);
  })
}

// crea una reserva y actualiza el stock del ticket seleccionado
export const reserveTickets = function(req:Request,res:Response){
  const idPurchase = v4();
  const {amount,idTicket} = req.body;
  Ticket.update(
    {stock: Sequelize.literal(`stock - ${amount}`)},
    {where:{id_ticket:Number(idTicket)}}
  )
  .then((result)=>{
    res.status(201).json({code:idPurchase});
  })
  .catch((error)=>{
    console.log(error);
  });
}

// reautaura el stock de un ticket al cancelar la compra
export const restoreTicket = function(req:Request,res:Response){
  const {amount,idTicket} = req.body;
  Ticket.update(
    {stock:Sequelize.literal(`stock + ${amount}`)},
    {where:{id_ticket:Number(idTicket)}}
  )
  .then((result)=>{
    res.status(201).send('cancel');
  })
  .catch((error)=>{
    console.log(error);
  });
}

export const successfulPaymentPage = function(req:Request,res:Response){
  res.sendFile(path.join(__dirname,'../../source/views/cinemark_UI/success_payment.html'));
}

// inserta una nueva orden de compra a la base de datos
export const newPurchaseOrder = function(req:Request,res:Response){
  type purchase = {
    idPurchase:string,
    total:number
  }
  const payload = getPayload(req);
  const {idPurchase,total}: purchase = req.body;
  const purchaseData = {
    id_purchase:idPurchase,
    customer:payload.iduser,
    total:total
  }
  PurchaseOrder.create(purchaseData)
  .then((result)=>{
    res.send('success');
  })
  .catch((error)=>{
    if(error.parent.errno === 1062){
      res.status(400).send('Duplicate entry!');
    }
    else{
      console.log(error);
    }
  });
}

// inserta el detalle de orden de compra en la base de datos
export const newPurchaseDetails = function(req:Request,res:Response){
  type purchaseData = {
    idTicket:number,
    idPurchaseOrder:string,
    amount:number,
    subtotal:number
  }
  const {idTicket,idPurchaseOrder,amount,subtotal}: purchaseData = req.body
  const purchaseDetails = {
    ticket_movie:idTicket,
    id_purchase_order:idPurchaseOrder,
    amount_ticket:amount,
    unit_price:idTicket,
    subtotal:subtotal
  }
  PurchaseDetails.create(purchaseDetails)
  .then((result)=>{
    res.send('success');
  })
  .catch((error)=>{
    console.log(error);
  })
}

// obtiene la informacion de la orden de una compra realizada
export const getDataPurchase = function(req:Request,res:Response){
  const idPurchase:string = req.params.code.replace(':','');
  PurchaseDetails.findAll({
    include:[{
      model:PurchaseOrder,
      as:'purchasesOrders',
      attributes:['id_purchase','date_purchase','total'],
      include:[{
        model:User,
        as:'users',
        attributes:['fullname']
      }]
    },
    {
      model:Ticket,
      as:'tickets',
      attributes:['date_ticket','subtitles','ticket_price'],
      include:[{
        model:Movie,
        as:'movies',
        attributes:['title','poster']
      },
      {
        model:Format,
        as:'formats',
        attributes:['type_format']
      }
    ]}
  ],
    where:{
      id_purchase_order:idPurchase
    },
    attributes:['amount_ticket']
  })
  .then((result)=>{
    res.json(result[0])
  })
  .catch((error)=>{
    console.log(error);
  })
}

// envia las ordenes de compra de un usuario
export const getUserPurchase = function(req:Request,res:Response){
  const payload = getPayload(req);
  PurchaseDetails.findAll({
    include:[
      {
        model:Ticket,
        as:'tickets',
        attributes:['id_ticket'],
        include:[{
          model:Movie,
          as:'movies',
          attributes:['title','poster'],
        },
        {
          model:Format,
          as:'formats',
          attributes:['type_format']
        }]
      },
      {
        model:PurchaseOrder,
        as:'purchasesOrders',
        attributes:['date_purchase','total','customer'],
        where:{
          customer:payload.iduser
        }
      }
    ],
    attributes:['id_purchase_order','amount_ticket'],
  })
  .then((result)=>{
    res.send(result);
  })
  .catch((error)=>{
    console.log(error);
  })
}

export const serverError = function(req:Request,res:Response){
  res.sendFile(path.join(__dirname,'../../source/views/cinemark_UI/server_error.html'))
}