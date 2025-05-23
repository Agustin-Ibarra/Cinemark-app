import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { v4 } from 'uuid';
import { getPayload } from './controllers.user.js';
import { Clasification, Format, Movie } from '../models/movies.models.js';
import { Ticket } from '../models/tickets.models.js';
import { Sequelize } from 'sequelize-typescript';
import { PurchaseDetails, PurchaseOrder } from '../models/purchase.models.js';
import { User } from '../models/users.models.js';

const _dirname  = path.resolve();

export const getHome = function(req:Request,res:Response){
  res.sendFile(path.join(_dirname,'app/source/views/cinemark_UI/home.html'));
}

/**
 * obtiene el catalago de peliculas del formato especificado en parametro query
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const getMoviesByFormat = function(req:Request,res:Response,next:NextFunction): void{
  interface movieData {
    id_movie:number,
    poster:string,
    format:number
  }
  interface movieList {
    movies2D:movieData[],
    movies3D:movieData[],
    moviesPremier:movieData[]
  }
  const movies:movieList = {
    movies2D:[],
    movies3D:[],
    moviesPremier:[]
  }
  Movie.findAll({attributes:['id_movie','title','poster','format','premier']})
  .then((result)=>{
    for(let i=0; i<result.length; i++){
      if(result[i].dataValues.premier === 1){
        movies.moviesPremier.push(result[i].dataValues);
      }
      else if(result[i].dataValues.format === 1){
        movies.movies2D.push(result[i].dataValues);
      }
      else if(result[i].dataValues.format === 2){
        movies.movies3D.push(result[i].dataValues);
      }
      else if(result[i].dataValues.format === 4){
        movies.movies3D.push(result[i].dataValues);
        movies.movies2D.push(result[i].dataValues);
      }
    }
    res.status(200).json(movies);
  })
  .catch((error)=>{
    next(error);
  });
}

export const getMoviePage = function(req:Request,res:Response){
  res.sendFile(path.join(_dirname,'app/source/views/cinemark_UI/movies.html'));
}

/**
 * obtiene informacion de una pelicula mediante el id
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const getMovieInfo = function(req:Request,res:Response,next:NextFunction):void{
  const id:Number = Number(req.params.id);
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
    res.json(result);
  })
  .catch((error)=>{
    next(error);
  });
}

/**
 * obtiene informacion de los tickets disponibles de una pelicula
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const getMovieTicketData = function(req:Request,res:Response,next:NextFunction):void{
  const idMovie:Number = Number(req.params.id);
  if(req.params.format === 'premier'){
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
      res.json(result);
    })
    .catch((error)=>{
      next(error);
    });
  }
  else{
    const format = Number(req.params.format);
    Ticket.findAll({
      include:[{
          model:Format,
          as:'formats',
          attributes:['type_format']
        },
        {
          model:Movie,
          as:'movies',
          attributes:['title']
        }],
      where:{
        movie:idMovie,
        ticket_format:format
      },
      attributes:['id_ticket','date_ticket','subtitles','stock','ticket_price']
    })
    .then((result)=>{
      res.json(result);
    })
    .catch((error)=>{
      console.log(error);
    });
  }
}

/**
 * actualiza el stock de un ticket al realizar la compra
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const reserveTickets = function(req:Request,res:Response):void{
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

/**
 * actualiza el stock de un ticket al cancelar la compra
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const restoreTicket = function(req:Request,res:Response):void{
  const {amount,idTicket} = req.body;
  Ticket.update(
    {stock:Sequelize.literal(`stock + ${amount}`)},
    {where:{id_ticket:Number(idTicket)}}
  )
  .then((result)=>{
    res.status(201).json({message:'modified reserve'});
  })
  .catch((error)=>{
    console.log(error);
  });
}

export const successfulPaymentPage = function(req:Request,res:Response){
  res.sendFile(path.join(_dirname,'app/source/views/cinemark_UI/success_payment.html'));
}

/**
 * crea un nuevo registro de una orden de compra
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const newPurchaseOrder = function(req:Request,res:Response,next:NextFunction):void{
  type requestType = {
    id_purchase:string,
    total:number
  }
  const payload = getPayload(req);
  const {id_purchase,total}: requestType = req.body;
  console.log(id_purchase)
  const purchaseData = {
    id_purchase:id_purchase,
    customer:payload.iduser,
    total:total,
    seller:'cinemark'
  }
  PurchaseOrder.create(purchaseData)
  .then((result)=>{
    res.json({message:'purchase created'});
  })
  .catch((error)=>{
    console.log(error);
    if(error.parent.errno === 1062){
      res.status(400).json({error:'duplicate purchase id!'});
    }
    else{
      next(error);
    }
  });
}

/**
 * crea un nuevo registro de un detalle de una orden de compra
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const newPurchaseDetails = function(req:Request,res:Response,next:NextFunction):void{
  type requetsType = {
    idTicket:number,
    id_purchase:string,
    amount:number,
    subtotal:number
  }
  const {idTicket,id_purchase,amount,subtotal}: requetsType = req.body
  const purchaseDetails = {
    id_purchase_details:Math.round(Math.random() * (90 - 10 + 1)),
    ticket_movie:idTicket,
    id_purchase_order:id_purchase,
    amount_ticket:amount,
    unit_price:idTicket,
    sub_total:subtotal
  }
  console.log(id_purchase);
  PurchaseDetails.create(purchaseDetails)
  .then((result)=>{
    res.json({message:'purchase details created'});
  })
  .catch((error)=>{
    next(error);
  });
}

/**
 * obtiene informacion de una orden de compra que acaba de ser realizada
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const getDataPurchase = function(req:Request,res:Response,next:NextFunction):void{
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
    attributes:['amount_ticket','sub_total']
  })
  .then((result)=>{
    res.json(result[0]);
  })
  .catch((error)=>{ 
    next(error);
  });
}

/**
 * obtiene informacion de las ordenes de compra de un usuario
 * @param req interface Request
 * @param res interface Request
 * @returns {void}
 */
export const getUserPurchase = function(req:Request,res:Response):void{
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
    res.json(result);
  })
  .catch((error)=>{
    console.log(error);
  });
}

export const serverError = function(req:Request,res:Response){
  res.sendFile(path.join(_dirname,'app/source/views/cinemark_UI/server_error.html'));
}