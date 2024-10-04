import express, { NextFunction, Request, Response }  from 'express';
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
  max:50,
});

router.use(express.json());
router.use('/login/user',checkLogin);
router.use('/singup/user',checkSingUp);
router.use('/home/account',isAuth);
router.use('/home/movie_page/reserve_tickets',isAuth);
router.use('/home',morgan(format,{stream:accesToLogStream}));
router.use('/login',morgan(format,{stream:accesToLogStream}));
router.use('/sing_up',morgan(format,{stream:accesToLogStream}));
router.use('/login',limiter);
router.use('/home',limiter);
router.use('/login/user',loginLimit);

router.get('/home',getHome);
router.get('/home/premiers',cache('1 day'),getPremiersMovies);
router.get('/home/movies_3D',cache('1 day'),get3DMovies);
router.get('/home/movies_2D',cache('1 day'),get2DMovies);
router.get('/home/movies_2D',get2DMovies);
router.get('/home/server_error',serverError);
router.get('/home/movie_page',getMoviePage)
router.get('/home/movie_page/movie/id:id',getMovieInfo);
router.get('/home/movie_page/ticket/id:id',getMovieTicketData);
router.get('/home/movie_page/ticket2D/id:id',getMovieTicketDataFromat2D);
router.get('/home/movie_page/ticket3D/id:id',getMovieTicketDataFromat3D);
router.get('/home/movie_page/success_payment',successfulPaymentPage);
router.get('/home/movie_page/success_payment/data_purchase/code:code',getDataPurchase);
router.get('/home/account',getAccount);
router.get('/home/account/user_purchase',getUserPurchase);
router.get('/home/account/profile',profile);
router.get('/singup',getRegister);
router.get('/login',getLogin);

router.post('/login/user',postLogin);
router.post('/singup/user',postRegister);
router.post('/home/movie_page/success_payment/new_purchase',newPurchaseOrder);
router.post('/home/movie_page/success_payment/new_purchase_details',newPurchaseDetails);
router.post('/home/movie_page/payments',paymentSession);

router.put('/home/account/profile/update_fullname',updateFullname);
router.put('/home/account/profile/update_email',updateEmail);
router.put('/home/account/profile/update_username',updateUsername);
router.put('/home/account/profile/update_password',updatePassword);
router.put('/home/movie_page/reserve_tickets',reserveTickets);
router.put('/home/movie_page/restore_tickets',restoreTicket);

router.delete('/home/account/profile/delete_account',deleteAccount);

export default router;