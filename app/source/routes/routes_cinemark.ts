import { Request, Response } from 'express';
import { dataPurchase, movieInfo, movies2D, movies3D, premiers, purchaseDetails, purchaseOrder, restoreStock, ticketData, ticketData2D, ticketData3D, updateStock, userPurchase } from '../models/movies_models.js';
import path from 'path';
import {fileURLToPath} from 'url';
import { v4 } from 'uuid';
import  jsonWebToken  from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getPayload } from '../controllers/routes/routes_user.js';

dotenv.config();
const __dirname  = path.dirname(fileURLToPath(import.meta.url));

interface ResultHeader{
  fieldCount:number,
  affectedRows:number,
  insertId:number,
  info:string,
  serverStatus:number,
  warningStatus:number,
  changedRows:number
}

export const getHome = function(req:Request,res:Response){
  res.sendFile(path.join(__dirname,'../../../source/views/cinemark_UI/home.html'));
}

export const getPremiersMovies = function(req:Request,res:Response){
  premiers()
  .then((data)=>{res.send(data);})
  .catch((error)=>{res.status(503).send('Content not available');});
}

// envia informacion de las peliculas del fromato 3D
export const get3DMovies = function(req:Request,res:Response){
  movies3D()
  .then((data)=>{res.send(data);})
  .catch((error)=>{res.status(503).send('Content not available')});
}

// envia informacion de las peliculas del fromato 2D
export const get2DMovies = function(req:Request,res:Response){
  movies2D()
  .then((data)=>{res.send(data);})
  .catch((error)=>{res.status(503).send('Content not available')});
}

export const getMoviePage = function(req:Request,res:Response){
  res.sendFile(path.join(__dirname,'../../../source/views/cinemark_UI/movie.html'));
}

// envia informacion de una pelicula seleccionada
export const getMovieInfo = function(req:Request,res:Response){
  const id:Number = Number(req.params.id.replace(':',''));
  movieInfo(id)
  .then((data)=>{res.send(data);})
  .catch((error)=>{res.status(503).send('Content not available');});
}

// envia informacion de los tickets de una pelicula
export const getMovieTicketData = function(req:Request,res:Response){
  const idMovie:Number = Number(req.params.id.replace(':',''));
  ticketData(idMovie)
  .then((results)=>{res.send(results);})
  .catch((error)=>{res.status(503).send('Content not available')});
}

// envia informacion de los tickets de las peliculas de formato 2D
export const getMovieTicketDataFromat2D = function(req:Request,res:Response){
  const idMovie:Number = Number(req.params.id.replace(':',''));
  ticketData2D(idMovie)
  .then((results)=>{res.send(results);})
  .catch((error)=>{res.status(500).send('Content not available')});
}

// envia informacion de los tickets de las peliculas de formato 3D
export const getMovieTicketDataFromat3D = function(req:Request,res:Response){
  const idMovie:Number = Number(req.params.id.replace(':',''));
  ticketData3D(idMovie)
  .then((results)=>{res.send(results);})
  .catch((error)=>{res.status(500).send('Content not available')});
}

// crea una reserva de un ticket
export const reserveTickets = function(req:Request,res:Response){
  const idPurchase = v4();
  const idTicket:number = Number( req.body.idTicket);
  const amount:number = req.body.amount;
  updateStock(idTicket,amount)
  .then((result)=>{
    const data = result as ResultHeader;
    if(data.affectedRows === 1 && data.serverStatus === 2){
      res.status(201).send({code:idPurchase});
    }
    else{res.status(400).send({error:'empty'});}
  })
  .catch((error)=>{res.status(503).send('Content not available')});
}

// restaura el stock de un ticket
export const restoreTicket = function(req:Request,res:Response){
  const idTicket:number = req.body.idTicket;
  const amount:number = req.body.amount;
  restoreStock(idTicket,amount)
  .then((result)=>{res.status(201).send();})
  .catch((error)=>{res.status(503).send('Content not available');});
}

export const successfulPaymentPage = function(req:Request,res:Response){
  res.sendFile(path.join(__dirname,'../../../source/views/cinemark_UI/success_payment.html'));
}

// inserta una nueva orden de compra a la base de datos
export const newPurchaseOrder = function(req:Request,res:Response){
  const payload = getPayload(req);
  const idPurchase:string = req.body.idPurchase;
  const total:number = Number(req.body.total);
  purchaseOrder(payload.iduser,idPurchase,total)
  .then((result)=>{
    res.send('success');
  })
  .catch((error)=>{
    if(error.errno === 1062){
      res.status(400).send('Duplicate entry!');
    }
    else{
      res.status(503).send('Content not available');
    }
  });
}

// inserta el detalle de orden de compra en la base de datos
export const newPurchaseDetails = function(req:Request,res:Response){
  const idTicket:number = Number(req.body.idTicket);
  const idPurchaseOrder:string = req.body.purchaseOrder;
  const amount:number = Number(req.body.amount);
  const subtotal:number = Number(req.body.subtotal);
  purchaseDetails(idPurchaseOrder,idTicket,amount,idTicket,subtotal)
  .then((result)=>{res.send('success');})
  .catch((error)=>{res.status(503).send('Content not available');});
}

// obtiene la informacion de la orden de compra realizada
export const getDataPurchase = function(req:Request,res:Response){
  const idPurchase:string = req.params.code.replace(':','');
  dataPurchase(idPurchase)
  .then((result)=>{
    res.send(result)
  })
  .catch((error)=>{
    res.status(503).send('Content not available');
  });
}

// retorna los datos de las ordenes de comopra del usuario
export const getUserPurchase = function(req:Request,res:Response){
  const payload = getPayload(req);
  userPurchase(payload.iduser)
  .then((result)=>{
    if(Array.isArray(result)){
      if(result.length === 0){
        res.status(404).send();
      }
      else{
        res.send(result);
      }
    }
  })
  .catch((error)=>{console.log(error);res.status(400).send('Content not available')});
}

export const serverError = function(req:Request,res:Response){
  res.sendFile(path.join(__dirname,'../../../source/views/cinemark_UI/server_error.html'))
}