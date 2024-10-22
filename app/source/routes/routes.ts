import express, { Request, Response }  from 'express';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import apicache from 'apicache'
import { getHome, getMoviePage, getMovieInfo, getMovieTicketData, reserveTickets, successfulPaymentPage, newPurchaseOrder, newPurchaseDetails, getDataPurchase, getUserPurchase, restoreTicket, serverError, getMoviesByFormat } from '../controller/controllers.cinemark.js'
import { deleteAccount, getAccount, getLogin, getRegister, postLogin, postRegister, profile, updateEmail, updateFullname, updatePassword, updateUsername } from '../controller/controllers.user.js';
import { checkLogin, checkSingUp, checkValuesToUpdate, errorServer, isAuth } from '../middlewres/middlewares.js';
import { paymentSession } from '../controller/controller.payments.js';

const _dirname = path.resolve();
const accesToLogStream = fs.createWriteStream(path.join(_dirname,'app/dist/monitoring/access.csv'),{flags:'a'}); // crea archivo logs
accesToLogStream.write('date;method;url;status_code;content-length;response_time;remote_addres\n'); // escribe el archivo logs
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

router.use('/home',express.json());
router.use('/login',express.json());
router.use('/login/user',checkLogin);
router.use('/singup',checkSingUp);
router.use('/home/account',isAuth);
router.use('/home/movie/reserve_tickets',isAuth);
router.use('/home/account/profile/fullname',checkValuesToUpdate);
router.use('/home/account/profile/email',checkValuesToUpdate);
router.use('/home/account/profile/username',checkValuesToUpdate);
router.use('/home/account/profile/password',checkValuesToUpdate);
router.use('/home',morgan(format,{stream:accesToLogStream}));
router.use('/login',morgan(format,{stream:accesToLogStream}));
router.use('/sing_up',morgan(format,{stream:accesToLogStream}));
router.use('/home',limiter);

router.get('/home',getHome);
router.get('/home/list',cache('1 day'),getMoviesByFormat);
router.get('/home/list',getMoviesByFormat);
router.get('/home/movie',getMoviePage)
router.get('/home/movie/id:id',getMovieInfo);
router.get('/home/movie/ticket/:format/:id',getMovieTicketData);
router.get('/home/movie/payments',successfulPaymentPage);
router.get('/home/movie/payments/purchase/code:code',getDataPurchase);
router.get('/home/account',getAccount);
router.get('/home/account/purchases',getUserPurchase);
router.get('/home/account/profile',profile);
router.get('/singup',limiter,getRegister);
router.get('/login',limiter,getLogin);
router.get('/home/error',serverError);

router.post('/login/user',loginLimit,postLogin);
router.post('/singup',postRegister);
router.post('/home/movie/payments/purchase',newPurchaseOrder);
router.post('/home/movie/payments/purchase_details',newPurchaseDetails);
router.post('/home/movie/payments',paymentSession);

router.patch('/home/account/profile/fullname',updateFullname);
router.patch('/home/account/profile/email',updateEmail);
router.patch('/home/account/profile/username',updateUsername);
router.patch('/home/account/profile/password',updatePassword);
router.patch('/home/movie/reserve_tickets',reserveTickets);
router.patch('/home/movie/restore_tickets',restoreTicket);

router.delete('/home/account/profile',deleteAccount);

// router.use('/home',errorServer);
// router.use('/login',errorServer);
// router.use('/singup',errorServer);

export default router;