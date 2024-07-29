import { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { logRouts } from 'app/source/middlewres/monitoring.js';

const stripe = new Stripe(`${process.env.STRIPE}`);
const logsPayments:object[] = []
dotenv.config();

/**
 * crea una sesion para poder realizar los pagos a travez de la API de srtipe
 * @param {object} req objeto Request 
 * @param {object} res objetos Response
 * @returns {void}
 */
export const paymentSession = async function(req:Request,res:Response):Promise<void>{
  logRouts(logsPayments);
  const total = req.body.total;
  const movie = req.body.movie;
  const amount = req.body.amount;
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
    success_url:'http://localhost:3001/success_payment',
    cancel_url:'http://localhost:3001/movie_page'
  })
  res.send({url:session.url});
}