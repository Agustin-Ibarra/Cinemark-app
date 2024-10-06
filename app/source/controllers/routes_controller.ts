import express, { Request, Response }  from 'express';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import apicache from 'apicache'
import { getHome, get3DMovies, getMoviePage, get2DMovies, getPremiersMovies, getMovieInfo, getMovieTicketData, getMovieTicketDataFromat2D, getMovieTicketDataFromat3D, reserveTickets, successfulPaymentPage, newPurchaseOrder, newPurchaseDetails, getDataPurchase, getUserPurchase, restoreTicket, serverError } from '../routes/routes_cinemark.js'
import { deleteAccount, getAccount, getLogin, getRegister, postLogin, postRegister, profile, updateEmail, updateFullname, updatePassword, updateUsername } from '../routes/routes_user.js';
import { checkLogin, checkSingUp, isAuth } from '../middlewres/middlewares.js';
import { paymentSession } from '../routes/routes_payments.js';

const _dirname = path.resolve();
const accesToLogStream = fs.createWriteStream(path.join(_dirname,'app/dist/controllers/access.csv'),{flags:'a'});
accesToLogStream.write('date;method;url;status_code;content-length;response_time;remote_addres\n');
const format = ':date;:method;:url;:status;:res[content-length];:response-time;:remote-addr';
const router = Router();
const cache = apicache.middleware;
const loginLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max:10,
});
const limiter = rateLimit({
  handler:(req:Request,res:Response)=>{
    res.status(429).sendFile(path.join(_dirname,'app/source/views/cinemark_UI/limit.html'));
  },
  windowMs: 30*60*1000,
  max:100,
});

router.use(express.json());
router.use('/login/user',checkLogin);
router.use('/singup/user',checkSingUp);
router.use('/home/account',isAuth);
router.use('/home/movies/reserve_tickets',isAuth);
router.use('/home',morgan(format,{stream:accesToLogStream}));
router.use('/login',morgan(format,{stream:accesToLogStream}));
router.use('/sing_up',morgan(format,{stream:accesToLogStream}));
router.use('/home',limiter);

router.get('/home',getHome);
router.get('/home/premiers',cache('1 day'),getPremiersMovies);
router.get('/home/movies_3D',cache('1 day'),get3DMovies);
router.get('/home/movies_2D',cache('1 day'),get2DMovies);
router.get('/home/server_error',serverError);
router.get('/home/movies',getMoviePage)
router.get('/home/movies/:id',getMovieInfo);
router.get('/home/movies/ticket/:id',getMovieTicketData);
router.get('/home/movies/ticket_2D/:id',getMovieTicketDataFromat2D);
router.get('/home/movies/ticket_3D/:id',getMovieTicketDataFromat3D);
router.get('/home/movies/payments',successfulPaymentPage); // check
router.get('/home/movies/payments/purchase/:code',getDataPurchase); //check
router.get('/home/account',getAccount);
router.get('/home/account/purchases',getUserPurchase);
router.get('/home/account/profile',profile);
router.get('/singup',limiter,getRegister);
router.get('/login',limiter,getLogin);

router.post('/login',loginLimit,postLogin);
router.post('/singup',postRegister);
router.post('/home/movies/payments/purchase',newPurchaseOrder); //cehck
router.post('/home/movies/payments/purchase_details',newPurchaseDetails); //check
router.post('/home/movies/payments',paymentSession);

router.patch('/home/account/profile/fullname',updateFullname);
router.patch('/home/account/profile/email',updateEmail);
router.patch('/home/account/profile/username',updateUsername);
router.patch('/home/account/profile/password',updatePassword);
router.patch('/home/movies/reserve_tickets',reserveTickets);
router.patch('/home/movies/restore_tickets',restoreTicket);

router.delete('/home/account/profile',deleteAccount);

export default router;