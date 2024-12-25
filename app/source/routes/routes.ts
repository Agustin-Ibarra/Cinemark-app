import express, { Request, Response }  from 'express';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import apicache from 'apicache'
import { getHome, getMoviePage, getMovieInfo, getMovieTicketData, reserveTickets, successfulPaymentPage, newPurchaseOrder, newPurchaseDetails, getDataPurchase, getUserPurchase, restoreTicket, serverError, getMoviesByFormat } from '../controller/controllers.cinemark.js'
import { deleteAccount, getAccount, getLogin, getRegister, postLogin, postRegister, profile, updateEmail, updateFullname, updatePassword, updateUsername } from '../controller/controllers.user.js';
import { amountRules, emailRules, errorServer, formatIdRules, fullnameRules, idPurchaseRules, isAuth, paramIdMovieRules, passwordRules, ticketRules, totalRules, usernameRules, validateResult } from '../middlewares/middlewares.js';
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

router.use(express.json());
router.use('/home',morgan(format,{stream:accesToLogStream}));
router.use('/home',limiter);
router.use('/login',morgan(format,{stream:accesToLogStream}),loginLimit);
router.use('/singup',morgan(format,{stream:accesToLogStream}),loginLimit);

router.get('/home',getHome);
router.get('/home/list',cache('1 day'),getMoviesByFormat);
router.get('/home/movie',getMoviePage)
router.get('/home/movie/:id',paramIdMovieRules,validateResult,getMovieInfo);
router.get('/home/movie/ticket/:format/:id',formatIdRules,validateResult,getMovieTicketData);
router.get('/home/movie/payments',successfulPaymentPage);
router.get('/home/movie/payments/purchase/:id_purchase',idPurchaseRules,validateResult,getDataPurchase);
router.get('/home/account',isAuth,getAccount);
router.get('/home/account/purchases',isAuth,cache('1 day'),getUserPurchase);
router.get('/home/account/profile',isAuth,cache('1 day'),profile);
router.get('/singup',limiter,getRegister);
router.get('/login',limiter,getLogin);
router.get('/home/error',serverError);

router.post('/login/',usernameRules,passwordRules,validateResult,postLogin);
router.post('/singup',fullnameRules,emailRules,usernameRules,passwordRules,validateResult,postRegister);
router.post('/home/movie/payments/purchase',idPurchaseRules,totalRules,validateResult,newPurchaseOrder);
router.post('/home/movie/payments/purchase_details',ticketRules,idPurchaseRules,amountRules,totalRules,validateResult,newPurchaseDetails);
router.post('/home/movie/payments',paymentSession);

router.patch('/home/account/profile/fullname',isAuth,fullnameRules,validateResult,updateFullname);
router.patch('/home/account/profile/email',isAuth,emailRules,validateResult,updateEmail);
router.patch('/home/account/profile/username',isAuth,usernameRules,validateResult,updateUsername);
router.patch('/home/account/profile/password',isAuth,passwordRules,validateResult,updatePassword);
router.patch('/home/movie/reserve_tickets',isAuth,ticketRules,amountRules,validateResult,reserveTickets);
router.patch('/home/movie/restore_tickets',isAuth,ticketRules,amountRules,validateResult,restoreTicket);

router.delete('/home/account/profile',isAuth,deleteAccount);

router.use('/home',errorServer);
router.use('/login',errorServer);
router.use('/singup',errorServer);

export default router;