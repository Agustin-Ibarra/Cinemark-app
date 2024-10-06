import { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

const stripe = new Stripe(`${process.env.STRIPE}`);
dotenv.config();

/**
 * crea una sesion para poder realizar los pagos a travez de la API de srtipe
 * @param req interface Request 
 * @param res interface Response
 * @returns {void}
 */
export const paymentSession = async function(req:Request,res:Response):Promise<void>{
  const total:number = Number(req.body.total);
  const movie:string = req.body.movie;
  const amount:number = req.body.amount;
  const session = await stripe.checkout.sessions.create({
    line_items:[{
      price_data:{
        product_data:{
          name:movie,
          description:'Ticket movie'
        },
        currency:'usd',
        unit_amount:total*100
      },
      quantity:amount
    }],
    mode:"payment",
    success_url:'http://localhost:3001/home/movies/payments',
    cancel_url:'http://localhost:3001/home/movies'
  });
  res.send({url:session.url});
}