import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { v4 } from 'uuid';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import { getPayload } from './controllers.user.js';
import { Clasification, Format, Movie } from '../models/movies.models.js';
import { Ticket } from '../models/tickets.models.js';
import { Sequelize } from 'sequelize-typescript';
import { PurchaseDetails, PurchaseOrder } from '../models/purchase.models.js';
import { User } from '../models/users.models.js';

dotenv.config();
const _dirname  = path.resolve();

export const getHome = function(req:Request,res:Response){
  console.log(req.url);
  res.sendFile(path.join(_dirname,'app/source/views/cinemark_UI/home.html'));
}

/**
 * obtiene el catalago de peliculas del formato especificado en parametro query
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const getMoviesByFormat = function(req:Request,res:Response,next:NextFunction): void{
  if(req.query.format === 'premier'){
    Movie.findAll({
      where:{
        premier:1
      },
      attributes:['id_movie','title','poster']
    })
    .then((result)=>{
      next();
      res.send(result);
    })
    .catch((error)=>{
      next(error);
    });
  }
  else if(req.query.format === '3D'){
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
      next()
      res.send(result);
    })
    .catch((error)=>{
      next(error);
    });
  }
  else if(req.query.format === '2D'){
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
      next();
      res.send(result);
    })
    .catch((error)=>{
      next(error);
    });
  }
  else{
    res.status(404).send('not found!');
  }
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
    res.send(result);
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
  if(req.params.format === 'premier'){
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
      res.send(result);
    })
    .catch((error)=>{
      next(error);
    });
    
  }
  else{
    const idMovie:Number = Number(req.params.id.replace(':',''));
    const format = Number(req.params.format.replace(':',''));
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
        ticket_format:format
      },
      attributes:['id_ticket','date_ticket','subtitles','stock','ticket_price']
    })
    .then((result)=>{
      res.send(result);
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
    res.status(201).send('cancel');
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
export const newPurchaseOrder = function(req:Request,res:Response):void{
  console.log(req.url);
  type purchase = {
    idPurchase:string,
    total:number
  }
  const payload = getPayload(req);
  const {idPurchase,total}: purchase = req.body;
  const purchaseData = {
    id_purchase:idPurchase,
    customer:payload.iduser,
    total:total,
    seller:'cinemark'
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

/**
 * crea un nuevo registro de un detalle de una orden de compra
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const newPurchaseDetails = function(req:Request,res:Response):void{
  type purchaseData = {
    idTicket:number,
    idPurchase:string,
    amount:number,
    subtotal:number
  }
  const {idTicket,idPurchase,amount,subtotal}: purchaseData = req.body
  const purchaseDetails = {
    id_purchase_details:Math.round(Math.random() * (90 - 10 + 1)),
    ticket_movie:idTicket,
    id_purchase_order:idPurchase,
    amount_ticket:amount,
    unit_price:idTicket,
    sub_total:subtotal
  }
  console.log(idPurchase);
  PurchaseDetails.create(purchaseDetails)
  .then((result)=>{
    res.send('success');
  })
  .catch((error)=>{
    console.log(error);
  });
}

/**
 * obtiene informacion de una orden de compra que acaba de ser realizada
 * @param req interface Request
 * @param res interface Response
 * @returns {void}
 */
export const getDataPurchase = function(req:Request,res:Response):void{
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
    console.log(result[0]);
    res.json(result[0]);
  })
  .catch((error)=>{
    console.log(error);
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
    res.send(result);
  })
  .catch((error)=>{
    console.log(error);
  });
}

export const serverError = function(req:Request,res:Response){
  res.sendFile(path.join(_dirname,'app/source/views/cinemark_UI/server_error.html'));
}